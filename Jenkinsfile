pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'salmank17/web-app:latest'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git url: 'https://github.com/salman61101/web-app.git', branch: 'main'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE .'
            }
        }

        stage('Push Docker Image') {
            steps {
                withDockerRegistry([credentialsId: 'dockerhub-creds', url: '']) {
                    sh 'docker push $DOCKER_IMAGE'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig-file', variable: 'KUBECONFIG')]) {
                    sh 'kubectl apply -f k8s/'
                    sh 'kubectl get pods'
                }
            }
        }
    }

    post {
        failure {
            echo 'Pipeline failed. Check logs above.'
        }
        success {
            echo 'Pipeline succeeded!'
        }
    }
}
