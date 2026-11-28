def runStage(String name, Closure body) {
    sh 'mkdir -p reports'
    try {
        body()
        sh "echo '${name}: PASSED' >> reports/pipeline-report.txt"
    } catch (e) {
        sh "echo '${name}: FAILED' >> reports/pipeline-report.txt"
        throw e
    }
}

def logged(String cmd, String file) {
    sh "${cmd} > reports/${file} 2>&1 || { cat reports/${file}; exit 1; }"
}

def collectLogs() {
    sh 'mkdir -p reports'
    sh 'docker compose ps -a > reports/compose-ps.txt 2>&1 || true'
    sh 'docker compose logs --no-color > reports/containers.log 2>&1 || true'
}

pipeline {
    agent any
    options {
        skipDefaultCheckout(true)
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
    }
    stages {
        stage('Checkout') {
            steps {
                deleteDir()
                checkout scm
                script {
                    env.COMPOSE_PROJECT_NAME = ('hotel-ci-' + env.BUILD_TAG).toLowerCase().replaceAll('[^a-z0-9_-]', '-')
                    env.APP_VERSION = env.TAG_NAME ?: env.COMPOSE_PROJECT_NAME
                    runStage('Checkout') {
                        if (env.TAG_NAME && !(env.TAG_NAME ==~ /v\d+\.\d+\.\d+/)) {
                            error('Tag invalide, format attendu : vX.Y.Z')
                        }
                        sh 'echo "Build: $BUILD_NUMBER | Ref: $BRANCH_NAME | Commit: $(git rev-parse HEAD)" >> reports/pipeline-report.txt'
                    }
                }
            }
        }
        stage('Setup') {
            steps {
                script {
                    env.DB_NAME = 'hotel_db'
                    env.DB_USER = 'hotel_user'
                    env.DB_PASSWORD = sh(returnStdout: true, script: 'cat /proc/sys/kernel/random/uuid').trim()
                    env.MYSQL_ROOT_PASSWORD = sh(returnStdout: true, script: 'cat /proc/sys/kernel/random/uuid').trim()
                    env.FRONTEND_PORT = '0'
                    env.BACKEND_PORT = '0'
                    runStage('Setup') {
                        sh 'docker version && docker compose version'
                        sh 'docker compose config -q'
                    }
                }
            }
        }
        stage('Build Node') {
            when { buildingTag() }
            parallel {
                stage('Node 22') {
                    steps { script { runStage('Build Node 22') {
                        logged('docker build --build-arg NODE_VERSION=22 -t hotel-backend:$APP_VERSION-node22 ./backend', 'backend-node22.log')
                        logged('docker build --build-arg NODE_VERSION=22 -t hotel-frontend:$APP_VERSION-node22 ./frontend', 'frontend-node22.log')
                    } } }
                }
                stage('Node 24') {
                    steps { script { runStage('Build Node 24') {
                        logged('docker build --build-arg NODE_VERSION=24 -t hotel-backend:$APP_VERSION-node24 ./backend', 'backend-node24.log')
                        logged('docker build --build-arg NODE_VERSION=24 -t hotel-frontend:$APP_VERSION-node24 ./frontend', 'frontend-node24.log')
                    } } }
                }
            }
        }
        stage('Build') {
            steps { script { runStage('Build') {
                logged('docker compose --progress plain build backend', 'build-backend.log')
                logged('docker compose --progress plain build frontend', 'build-frontend.log')
                logged('docker compose --progress plain build db', 'build-db.log')
            } } }
        }
        stage('Run (Docker)') {
            steps { script { runStage('Run (Docker)') {
                sh 'docker compose up -d --wait --wait-timeout 180'
            } } }
        }
        stage('Smoke Test') {
            steps {
                catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                    script { runStage('Smoke Test') {
                        sh 'code=0; sh scripts/smoke-test.sh > reports/smoke-test.log 2>&1 || code=$?; cat reports/smoke-test.log; exit $code'
                    } }
                }
            }
        }
        stage('Archive Artifacts') {
            steps { script { runStage('Archive Artifacts') {
                collectLogs()
                if (env.TAG_NAME && currentBuild.currentResult == 'SUCCESS') {
                    sh 'docker save -o reports/images-$TAG_NAME.tar hotel-backend:$APP_VERSION hotel-frontend:$APP_VERSION'
                }
            } } }
        }
    }
    post {
        always {
            script {
                collectLogs()
                sh "echo 'RESULT: ${currentBuild.currentResult}' >> reports/pipeline-report.txt"
                archiveArtifacts artifacts: 'reports/**', allowEmptyArchive: true
                stage('Cleanup') {
                    sh 'docker compose down -v --remove-orphans --rmi local || true'
                    if (!env.TAG_NAME) {
                        sh 'docker image rm hotel-backend:$APP_VERSION hotel-frontend:$APP_VERSION || true'
                    }
                }
            }
        }
    }
}
