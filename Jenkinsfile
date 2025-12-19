pipeline {
    agent any
    
    // Define your personal info here
    environment {
        MY_NAME = "Ryan"
        MY_ID   = "B11705059"
    }

    stages {
        stage('Static Analysis') {
            steps {
                sh 'npm install'
                sh 'npm run lint'
            }
        }
        stage('Staging Environment') {
            when { branch 'dev' }
            steps {
                // This matches the 'ID' you created in Jenkins
                withCredentials([usernamePassword(credentialsId: 'lsap_hw6_cicd', 
                                usernameVariable: 'ryan', 
                                passwordVariable: 'Shiquan0987627363')]) {
                    
                    script {
                        def imageName = "dev-${env.BUILD_NUMBER}"
                        
                        // 1. Build & Tag
                        sh "docker build -t ${imageName} ."
                        
                        // 2. Login & Push
                        sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin"
                        sh "docker push ${imageName}"
                        
                        // 3. Cleanup & Deploy
                        sh "docker rm -f dev-app || true"
                        sh "docker run -d --name dev-app -p 8081:8080 ${imageName}"
                        
                        // 4. Verify
                        sh "curl -f http://localhost:8081/health"
                    }
                }
            }
        }
    }

    post {
        failure {
            sh """
            curl -X POST -H "Content-Type: application/json" \
            -d '{
              "content": "❌ **Build Failed!**\\n**Name:** ${env.MY_NAME}\\n**Student ID:** ${env.MY_ID}\\n**Job:** ${env.JOB_NAME}\\n**Build #:** ${env.BUILD_NUMBER}\\n**Repo:** ${env.GIT_URL}\\n**Branch:** ${env.BRANCH_NAME}\\n**Status:** ${currentBuild.currentResult}"
            }' https://discord.com/api/webhooks/1446902762439971047/GZ62SXZkGOav9xy8yqpEnCtANLmeSpFsaQv7pvd3rnb8e_IV0mNPMtj2ekK3aLeqIZFf
            """
        }
        success {
             sh """
            curl -X POST -H "Content-Type: application/json" \
            -d '{
              "content": "✅ **Build Passed!**\\n**Name:** ${env.MY_NAME}\\n**Student ID:** ${env.MY_ID}\\n**Job:** ${env.JOB_NAME}\\n**Branch:** ${env.BRANCH_NAME}"
            }' https://discord.com/api/webhooks/1446902762439971047/GZ62SXZkGOav9xy8yqpEnCtANLmeSpFsaQv7pvd3rnb8e_IV0mNPMtj2ekK3aLeqIZFf
            """
        }
    }
}