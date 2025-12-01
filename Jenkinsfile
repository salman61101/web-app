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

    stage('Start App for Selenium') {
      steps {
        echo 'Starting app in background for Selenium tests'
        sh '''
          nohup node app.js > app.log 2>&1 &
          echo "App started; waiting for port 3000"
          # wait for app to respond
          for i in $(seq 1 20); do
            if curl -sSf http://127.0.0.1:3000 >/dev/null 2>&1; then echo "App is up"; break; fi
            sleep 1
          done
        '''
      }
    }

    stage('Selenium Testing') {
      steps {
        echo 'Running Selenium tests with Mocha'
        sh '''
          npm ci || npm install
          npm test
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
    }
  }
}
