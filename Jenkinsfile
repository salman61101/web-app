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
        sh 'echo "All tests passed"'
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
