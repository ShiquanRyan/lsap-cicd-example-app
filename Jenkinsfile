pipeline {
    agent any

    stages {
        stage('Static Analysis') {
            steps {
                echo 'Running Linting checks...'
                // This runs the command you defined in package.json
                sh 'npm install'
                sh 'npm run lint'
            }
        }
    }
    
    post {
        failure {
            // This runs ONLY if the linting fails
            sh """
            curl -X POST -H "Content-Type: application/json" \
            -d '{"content": "❌ **CI Alert:** Linting failed on branch ${env.BRANCH_NAME}. Check Jenkins for details!"}' \
            https://discord.com/api/webhooks/1446902762439971047/GZ62SXZkGOav9xy8yqpEnCtANLmeSpFsaQv7pvd3rnb8e_IV0mNPMtj2ekK3aLeqIZFf
            """
        }
        success {
            echo 'Linting passed!'
        }
    }
}