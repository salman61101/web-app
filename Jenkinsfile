pipeline {
    agent any

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
                // Use kubeconfig from Jenkins credentials
                withCredentials([file(credentialsId: 'kubeconfig-file', variable: 'KUBECONFIG')]) {
                    sh 'kubectl apply -f k8s/'
                    sh 'kubectl get pods'
                }
            }
        }
    }

    post {
        failure { echo "Pipeline failed. Check logs above." }
        success { echo "Pipeline succeeded!" }
    }
}
