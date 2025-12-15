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

        stage('Install Node Dependencies') {
            steps {
                // Install Node.js dependencies defined in package.json
                // Requires Node.js and npm to be installed on the Jenkins agent
                sh 'npm install'
            }
        }

        stage('Run Selenium Tests') {
            steps {
                // Informational log in Jenkins console
                echo 'Running Selenium tests...'

                // Execute Selenium test cases using npm test
                // This runs Mocha tests located in tests/selenium/
                // If any test fails, the pipeline will stop here
                sh 'npm test'
                // Alternative:
                // sh 'npx mocha tests/selenium/*.test.js'
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
                    sh 'kubectl apply -f k8s/'
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
