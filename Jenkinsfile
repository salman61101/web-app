pipeline {
    agent any

    environment {
        // Path to kubeconfig so Jenkins can access Minikube
        KUBECONFIG = '/home/ubuntu/.kube/config'
    }

    stages {
        // Stage 1: Fetch code from GitHub
        stage('Code Fetch') {
            steps {
                // Clone the main branch of your project repository
                git branch: 'main', url: 'https://github.com/salman61101/web-app.git'
            }
        }

        // Stage 2: Build Docker image
        stage('Build Docker Image') {
            steps {
                // Build the Docker image for your app
                sh 'docker build -t salmank17/web-app:latest .'
            }
        }

        // Stage 3: Push Docker image to Docker Hub
        stage('Push Docker Image') {
            steps {
                // Authenticate and push image to Docker Hub
                withDockerRegistry([ credentialsId: 'dockerhub-creds', url: 'https://index.docker.io/v1/' ]) {
                    sh 'docker push salmank17/web-app:latest'
                }
            }
        }

        // Stage 4: Deploy to Kubernetes (Minikube)
        stage('Deploy to Kubernetes') {
            steps {
                // Ensure kubeconfig is readable by Jenkins user
                sh 'sudo chown -R ubuntu:ubuntu /home/ubuntu/.kube'
                // Apply all Kubernetes YAML manifests
                sh 'kubectl apply -f k8s/'
            }
        }

        // Stage 5: Verify Deployment
        stage('Verify Deployment') {
            steps {
                // List pods to confirm deployment
                sh 'kubectl get pods'
                // List services to check if NodePort is created
                sh 'kubectl get svc'
            }
        }
    }

    post {
        // Notify if the pipeline fails
        failure {
            echo "Pipeline failed. Check the logs above to identify the issue."
        }
        // Notify if the pipeline succeeds
        success {
            echo "Pipeline completed successfully. App deployed to Kubernetes!"
        }
    }
}
