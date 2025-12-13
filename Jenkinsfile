pipeline {
    agent any

    stages {
        stage('Code Fetch') {
            steps {
                // Explicitly fetch 'main' branch
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
                withDockerRegistry([credentialsId: 'dockerhub-creds']) {
                    sh 'docker push salmank17/web-app:latest'
                }
            }
        }
    }
}
