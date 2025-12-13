pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "salmank17/web-app:latest"
        BASE_URL = "http://3.146.37.198:32595"  // used for Selenium tests if needed
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Checking out code from GitHub..."
                git url: 'https://github.com/salman61101/web-app.git', branch: 'main'
            }
        }

        stage('Install Node Dependencies') {
            steps {
                echo "Installing Node.js dependencies..."
                sh 'npm install'
            }
        }

        stage('Run Selenium Tests') {
            steps {
                echo 'Running Selenium tests...'
                // Pass BASE_URL to tests via environment variable
                withEnv(["BASE_URL=${BASE_URL}"]) {
                    sh 'npm test'
                    // or sh 'npx mocha tests/selenium/**/*.test.js --timeout 20000'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image $DOCKER_IMAGE..."
                sh 'docker build -t $DOCKER_IMAGE .'
            }
        }

        stage('Push Docker Image') {
            steps {
                echo "Pushing Docker image to DockerHub..."
                withDockerRegistry([credentialsId: 'dockerhub-cred', url: 'https://index.docker.io/v1/']) {
                    sh 'docker push $DOCKER_IMAGE'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo "Deploying application to Kubernetes..."
                withCredentials([file(credentialsId: 'kubeconfig-file', variable: 'KUBECONFIG')]) {
                    sh 'kubectl apply -f k8s/' // ensure k8s manifests include deployment, service, pvc
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                echo "Verifying deployment..."
                sh 'kubectl get pods -n default'
                sh 'kubectl get svc -n default'
                sh 'kubectl get nodes'
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completed successfully!"
        }
        failure {
            echo "❌ Pipeline failed! Check logs above for errors."
        }
    }
}
