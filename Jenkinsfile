pipeline {
    agent any

    // Set environment variable so kubectl knows where to find kubeconfig
    environment {
        KUBECONFIG = '/var/lib/jenkins/.kube/config'  // Ensure Jenkins user has read access
    }

    stages {
        // ----------------------------
        stage('Code Fetch') {
            steps {
                // Clone the main branch of the GitHub repository
                // This fetches the latest code for building the Docker image
                git branch: 'main', url: 'https://github.com/salman61101/web-app.git'
            }
        }

        // ----------------------------
        stage('Build Docker Image') {
            steps {
                // Build the Docker image using the Dockerfile in the repository
                // Tag the image with your Docker Hub username and 'latest'
                sh 'docker build -t salmank17/web-app:latest .'
            }
        }

        // ----------------------------
        stage('Push Docker Image') {
            steps {
                // Push the Docker image to Docker Hub
                // Uses credentials stored in Jenkins (dockerhub-creds)
                withDockerRegistry([credentialsId: 'dockerhub-creds']) {
                    sh 'docker push salmank17/web-app:latest'
                }
            }
        }

        // ----------------------------
        stage('Deploy to Kubernetes') {
            steps {
                // Deploy the application to Kubernetes
                // Apply all YAML manifests in the k8s/ folder
                sh 'kubectl apply -f k8s/'
            }
        }

        // ----------------------------
        stage('Verify Deployment') {
            steps {
                // Check if the pods are running correctly
                sh 'kubectl get pods'

                // Check if the service is created and accessible
                sh 'kubectl get svc'
            }
        }
    }

    // ----------------------------
    post {
        // Actions to take after pipeline completes
        success {
            echo 'Pipeline completed successfully! Web app should be deployed on Kubernetes.'
        }
        failure {
            echo 'Pipeline failed. Check the logs above to identify the issue.'
        }
    }
}
