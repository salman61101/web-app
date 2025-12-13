pipeline {
    agent any

    stages {
        stage('Code Fetch') {
            steps {
                git 'https://github.com/salman61101/web-app.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t yourdockerhub/ci-cd-app:latest .'
            }
        }

        stage('Push Docker Image') {
            steps {
                withDockerRegistry([credentialsId: 'dockerhub-creds']) {
                    sh 'docker push yourdockerhub/ci-cd-app:latest'
                }
            }
        }
    }
}
