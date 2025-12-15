pipeline {
    agent any
    environment {
        DOCKER_IMAGE = "salmank17/web-app:latest"
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/salman61101/web-app.git', branch: 'main'
            }
        }

        stage('Install Node Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Selenium Tests') {
            steps {
                echo 'Running Selenium tests...'
                sh 'npm test'  // or 'npx mocha tests/selenium/*.test.js'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE .'
            }
        }

        stage('Push Docker Image') {
            steps {
                withDockerRegistry([credentialsId: 'dockerhub-cred', url: 'https://index.docker.io/v1/']) {
                    sh 'docker push $DOCKER_IMAGE'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig-file', variable: 'KUBECONFIG')]) {
                    sh 'kubectl apply -f k8s/'
                }
            }
        }
    }

    post {
        failure {
            echo "Pipeline failed! Check logs above."
        }
    }
}
