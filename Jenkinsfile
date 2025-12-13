pipeline {
    agent any

    stages {
        // Stage 1: Fetch the source code from GitHub
        stage('Code Fetch') {
            steps {
                // Clone the 'main' branch from your GitHub repository
                git branch: 'main', url: 'https://github.com/salman61101/web-app.git'
            }
        }

        // Stage 2: Build the Docker image
        stage('Build Docker Image') {
            steps {
                // Build a Docker image with the tag 'salmank17/web-app:latest'
                sh 'docker build -t salmank17/web-app:latest .'
            }
        }

        // Stage 3: Push the Docker image to Docker Hub
        stage('Push Docker Image') {
            steps {
                // Use stored Docker Hub credentials in Jenkins
                withDockerRegistry([credentialsId: 'dockerhub-creds']) {
                    // Push the Docker image to your Docker Hub repository
                    sh 'docker push salmank17/web-app:latest'
                }
            }
        }

        // Stage 4: Deploy the application to Kubernetes
        stage('Deploy to Kubernetes') {
            steps {
                // Apply all Kubernetes manifests inside the 'k8s/' folder
                // This includes Deployment, Service, and PVC
                sh 'kubectl apply -f k8s/'
            }
        }

        // Optional: Verify deployment
        stage('Verify Deployment') {
            steps {
                // List all pods to confirm they are running
                sh 'kubectl get pods'

                // List services to check NodePort or ClusterIP
                sh 'kubectl get svc'
            }
        }
    }
}
