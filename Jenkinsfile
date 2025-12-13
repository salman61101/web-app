pipeline {
    agent any

    environment {
        // Docker image name & tag
        DOCKER_IMAGE = "salmank17/web-app:latest"
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Checking out code from GitHub..."
                git url: 'https://github.com/salman61101/web-app.git', branch: 'main'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "Installing NPM dependencies..."
                sh 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                sh "docker build -t $DOCKER_IMAGE ."
            }
        }

        stage('Push Docker Image') {
            steps {
                echo "Pushing Docker image to DockerHub..."
                withDockerRegistry([credentialsId: 'dockerhub-cred', url: 'https://index.docker.io/v1/']) {
                    sh "docker push $DOCKER_IMAGE"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo "Deploying to Kubernetes cluster..."
                withCredentials([file(credentialsId: 'kubeconfig-file', variable: 'KUBECONFIG')]) {
                    // Optional: delete previous deployment/service (PVC only if you want fresh)
                    sh 'kubectl delete deployment web-app --ignore-not-found=true'
                    sh 'kubectl delete service web-app-service --ignore-not-found=true'
                    
                    // Apply PVC first
                    sh 'kubectl apply -f k8s/pvc.yaml'
                    // Apply deployment & service
                    sh 'kubectl apply -f k8s/deployment.yaml'
                    sh 'kubectl apply -f k8s/service.yaml'
                    
                    // Wait for deployment to finish
                    sh 'kubectl rollout status deployment/web-app'
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                echo "Verifying pods and services..."
                withCredentials([file(credentialsId: 'kubeconfig-file', variable: 'KUBECONFIG')]) {
                    sh 'kubectl get pods -n default'
                    sh 'kubectl get svc -n default'
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful! Web-app is live and metrics should appear in Grafana."
        }
        failure {
            echo "❌ Deployment failed. Check logs above for errors."
        }
    }
}
