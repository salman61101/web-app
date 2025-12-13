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
                    sh 'kubectl cluster-info'
                    sh 'kubectl apply -f k8s/'  // adjust path to your manifests
                }
            }
        }
    }
    post {
        failure {
            echo "Deployment failed. Check logs above."
        }
    }
}
