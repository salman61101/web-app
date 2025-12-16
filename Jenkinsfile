pipeline {

    // Run the pipeline on any available Jenkins agent/node
    agent any

    // Global environment variables used across stages
    environment {
        // Docker image name and tag to be built and pushed
        DOCKER_IMAGE = "salmank17/web-app:latest"
    }

    stages {

        stage('Checkout') {
            steps {
                // Clone the source code from the GitHub repository (main branch)
                git url: 'https://github.com/salman61101/web-app.git', branch: 'main'
            }
        }

        stage('Build Docker Image') {
            steps {
                // Build Docker image using the Dockerfile in the repository
                // The image is tagged using the DOCKER_IMAGE environment variable
                sh 'docker build -t $DOCKER_IMAGE .'
            }
        }

        stage('Push Docker Image') {
            steps {
                // Authenticate with Docker Hub using Jenkins credentials
                withDockerRegistry(
                    [credentialsId: 'dockerhub-cred', url: 'https://index.docker.io/v1/']
                ) {
                    // Push the built Docker image to Docker Hub
                    sh 'docker push $DOCKER_IMAGE'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                // Load kubeconfig securely from Jenkins credentials
                withCredentials(
                    [file(credentialsId: 'kubeconfig-file', variable: 'KUBECONFIG')]
                ) {
                    // Deploy/update Kubernetes resources (Deployment, Service, PVC)
                    // YAML files are located in the k8s/ directory
                    // Using both flags to bypass validation and TLS verification for Minikube
                    sh 'kubectl apply -f k8s/ --insecure-skip-tls-verify --validate=false'
                }
            }
        }
    }

    post {
        failure {
            // Message shown if any stage fails
            echo "Pipeline failed! Check logs above."
        }
    }
}
