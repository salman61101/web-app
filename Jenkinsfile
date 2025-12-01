pipeline {
  agent any

  options {
    // We'll checkout explicitly in the first stage
    skipDefaultCheckout(true)
  }

  stages {
    stage('Clone Repository') {
      steps {
        echo 'Checking out source code...'
        checkout scm
        sh 'echo "Repository contents:" && ls -la'
      }
    }

    stage('Build') {
      steps {
        echo 'Building application (simple assignment, no real build)'
        sh 'echo "Build step complete"'
      }
    }

    stage('Test') {
      steps {
        echo 'Running tests (dummy for assignment)'
        sh 'echo "All tests passed (placeholder)"'
      }
    }

    stage('Deploy') {
      steps {
        echo 'Deploying (demo): preparing local artifacts folder'
        sh '''
          set -e
          rm -rf deploy
          mkdir -p deploy
          # For a simple HTML app, copy public files (adjust as needed)
          if [ -d public ]; then cp -r public/* deploy/ || true; fi
          # Package current workspace as a tarball to simulate an artifact
          tar -czf deploy/artifacts.tgz .
          echo "Deployment artifacts prepared in ./deploy"
        '''
      }
    }

    stage('Docker: Build App Image') {
      steps {
        echo 'Building Docker image for the app'
        sh '''
          set -e
          docker build -t web-app:ci .
          docker images | grep web-app | head -n 1 || true
        '''
      }
    }

    stage('Docker: Run App Container') {
      steps {
        echo 'Starting app container on a temporary network'
        sh '''
          set -e
          docker network rm webapp_net || true
          docker network create webapp_net
          # Remove any previous container
          docker rm -f webapp_app || true
          # Run app container attached to network
          docker run -d --name webapp_app --network webapp_net -p 3000:3000 web-app:ci
          echo "Waiting for app to be ready on http://127.0.0.1:3000"
          for i in $(seq 1 30); do
            if curl -sSf http://127.0.0.1:3000 >/dev/null 2>&1; then echo "App is up"; break; fi
            sleep 1
          done
        '''
      }
    }

    stage('Docker: Build Selenium Tests Image') {
      steps {
        echo 'Building Docker image for Selenium tests (Chrome)'
        sh '''
          set -e
          docker build -f Dockerfile.selenium -t web-app-tests:ci .
          docker images | grep web-app-tests | head -n 1 || true
        '''
      }
    }

    stage('Docker: Run Selenium Tests') {
      steps {
        echo 'Running Selenium tests container against the app'
        sh '''
          set -e
          # Run tests on same docker network so it can reach the app container by name
          docker rm -f webapp_tests || true
          # Pass base URL via env if needed; tests currently hit 127.0.0.1:3000
          docker run --name webapp_tests --network webapp_net web-app-tests:ci
        '''
      }
    }
  }

  post {
    success {
      echo 'Pipeline succeeded.'
    }
    failure {
      echo 'Pipeline failed.'
    }
    always {
      echo 'Pipeline finished.'
      // Cleanup docker resources
      sh '''
        docker rm -f webapp_app webapp_tests 2>/dev/null || true
        docker network rm webapp_net 2>/dev/null || true
      '''
    }
  }
}
