pipeline {
    agent any
    
    // Define your personal info here
    environment {
        MY_NAME = "Ryan"
        MY_ID   = "B11705059"
        GITHUB_TOKEN = credentials('lsap_hw6')
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
                withCredentials([usernamePassword(credentialsId: 'lsap_hw6_docker', 
                                usernameVariable: 'DOCKER_USER', 
                                passwordVariable: 'DOCKER_PASS')]) {
                    
                    script {
                        def TARGET_TAG = sh(
                            script: "node -p \"require('./package.json').version\"",
                            returnStdout: true
                        ).trim()

                        def imageName = "ryaninntusa/lsap_hw6:v${TARGET_TAG}"

                        // def imageName   = "ryaninntusa/lsap_hw6:dev-${env.BUILD_NUMBER}"
                        
                        // 1. Build & Tag
                        sh "docker build -t ${imageName} ."
                        
                        // 2. Login & Push
                        sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin"
                        sh "docker push ${imageName}"
                        
                        // 3. Cleanup & Deploy
                        sh '''
                            if [ "$(docker ps -aq -f name=^/dev-app$)" ]; then
                                echo "Found dev-app container, removing..."
                                docker rm -f dev-app
                            else
                                echo "dev-app container not found, skipping removal."
                            fi
                        '''
                        sh "docker run -d --name dev-app -p 8081:8081 ${imageName}"
                        
                        sh "sleep 3" // 等待容器啟動

                        // 4. Verify
                        sh "curl -f http://localhost:8081/health"
                    }
                }
            }
        }
        stage('Production Environment') {
            when { branch 'main' }
            steps {
                withCredentials([usernamePassword(credentialsId: 'lsap_hw6_docker', 
                                                usernameVariable: 'DOCKER_USER', 
                                                passwordVariable: 'DOCKER_PASS')]) {
                    script {
                        // 1. 讀取設定檔 (假設內容為 dev-1)
                        def TARGET_TAG = readFile('deploy.config').trim()
                        
                        // 2. 定義完整的 Image 名稱
                        def sourceImage = "ryaninntusa/lsap_hw6:${TARGET_TAG}"
                        def prodImage   = "ryaninntusa/lsap_hw6:prod-${env.BUILD_NUMBER}"
                        
                        echo "Promoting ${sourceImage} to ${prodImage}"

                        // 2. Artifact Promotion
                        sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin"
                        
                        // 修正後的 Pull 指令
                        sh "docker pull ${sourceImage}"
                        sh "docker tag ${sourceImage} ${prodImage}"
                        sh "docker push ${prodImage}"

                        // 3. Deploy (記得把內部的 8080 改成 8081，如果你 Dockerfile 是寫 8081)
                        sh '''
                            if [ "$(docker ps -aq -f name=^/prod-app$)" ]; then
                                echo "Found prod-app container, removing..."
                                docker rm -f prod-app
                            else
                                echo "prod-app container not found, skipping removal."
                            fi
                        '''
                        sh "docker run -d --name prod-app -p 8082:8081 ${prodImage}"
                        
                        echo "Deployment Successful on Port 8082"

                        sh "sleep 3" // 等待容器啟動

                        // 4. Verify
                        sh "curl -f http://localhost:8082/health"
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
              "content": "✅ **Build Passed!**\\n**Name:** ${env.MY_NAME}\\n**Student ID:** ${env.MY_ID}\\n**Job:** ${env.JOB_NAME}\\n**Build #:** ${env.BUILD_NUMBER}\\n**Repo:** ${env.GIT_URL}\\n**Branch:** ${env.BRANCH_NAME}\\n**Status:** ${currentBuild.currentResult}"
            }' https://discord.com/api/webhooks/1446902762439971047/GZ62SXZkGOav9xy8yqpEnCtANLmeSpFsaQv7pvd3rnb8e_IV0mNPMtj2ekK3aLeqIZFf
            """
        }
    }
}