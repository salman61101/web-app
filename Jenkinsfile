pipeline {
    agent any

    environment {
        // Path to kubeconfig readable by Jenkins
        KUBECONFIG = '/home/ubuntu/.kube/config'
    }

    stages {
        stage('Code Fetch') {
            steps {
                git branch: 'main', url: 'https://github.com/salman61101/web-app.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t salmank17/web-app:latest .'
            }
        }

        stage('Push Docker Image') {
            steps {
                withDockerRegistry([ credentialsId: 'dockerhub-creds', url: 'https://index.docker.io/v1/' ]) {
                    sh 'docker push salmank17/web-app:latest'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                // Deploy using a kubeconfig file Jenkins can access
                sh 'kubectl --kubeconfig=$KUBECONFIG apply -f k8s/'
            }
        }

        stage('Verify Deployment') {
            steps {
                sh 'kubectl --kubeconfig=$KUBECONFIG get pods'
                sh 'kubectl --kubeconfig=$KUBECONFIG get svc'
            }
        }
    }

    post {
        failure {
            echo "Pipeline failed. Check the logs above to identify the issue."
        }
        success {
            echo "Pipeline completed successfully. App deployed to Kubernetes!"
        }
    }
}
