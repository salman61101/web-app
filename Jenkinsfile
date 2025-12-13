pipeline {
    agent any

    environment {
        IMAGE_NAME = 'salmank17/web-app:latest'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/salman61101/web-app.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                    docker build -t $IMAGE_NAME .
                """
            }
        }

        stage('Push Docker Image') {
            steps {
                withDockerRegistry([credentialsId: 'dockerhub-cred', url: 'https://index.docker.io/v1/']) {
                    sh "docker push $IMAGE_NAME"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                // Use the kubeconfig file uploaded as Jenkins credential
                withCredentials([file(credentialsId: 'kubeconfig-file', variable: 'KUBECONFIG')]) {
                    sh """
                        # Optional: Test cluster connectivity
                        kubectl cluster-info
                        
                        # Apply Kubernetes manifests
                        kubectl apply -f k8s/
                    """
                }
            }
        }
    }

    post {
        success {
            echo "Deployment succeeded!"
        }
        failure {
            echo "Deployment failed. Check logs above."
        }
    }
}
