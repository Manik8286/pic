#!groovy
@Library('jenkins-shared-libs')_

pipeline {
  agent none
  options {
    buildDiscarder(logRotator(numToKeepStr: '10', artifactNumToKeepStr: '10'))
    ansiColor('xterm')
    disableConcurrentBuilds()
    skipDefaultCheckout()
  }
  environment {
    gitCredentialId = '2385cbf0-468a-4209-8c65-0c3996ad8863'
  }
  stages {
    stage('prepare') {
      agent any
      steps {
        script {
          def scmVars = checkout scm
          if (scmVars.GIT_BRANCH == "origin/master") {
            env.BASEURL = "https://assets.cdn-shop.com/bestcanvas3-se"
            env.FLUSH_URL = "www.bestcanvas.se"
            env.CLOUDFLARE_ZONE = ''
            env.ASSETS_BUCKET = "euc-picturator-assets"
            env.BASE_TPL_BRANCH = "master"
            env.TEMPLATE_BUCKET = "euc-picturator-templates"
            env.SLACK_CHANNEL = "jenkins_notifications_production"
            env.CLOUDFRONT_DISTRIBUTION_ID = "E2TJ6ZJ91QTD2U"
            env.DIRECTORY = 'bestcanvas3-se'
          }
          else if (scmVars.GIT_BRANCH == "origin/staging") {
            env.BASEURL = "https://assets.cdn-shop.com/bestcanvas3-se"
            env.FLUSH_URL = "staging-bestcanvas-se.picanova.de"
            env.CLOUDFLARE_ZONE = ''
            env.ASSETS_BUCKET = "euc-picturator-assets"
            env.BASE_TPL_BRANCH = "master"
            env.TEMPLATE_BUCKET = "euc-picturator-templates"
            env.SLACK_CHANNEL = "jenkins_notifications_production"
            env.CLOUDFRONT_DISTRIBUTION_ID = "E2WR0852SMJT2R"
            env.DIRECTORY = 'staging-bestcanvas3-se'
          }
          else {
            env.BASEURL = "https://testing-assets.cdn-shop.com/bestcanvas3-se"
            env.FLUSH_URL = "testing-bestcanvas-se.picanova.de"
            env.CLOUDFLARE_ZONE = ''
            env.ASSETS_BUCKET = "euc-picturator-assets-testing"
            env.BASE_TPL_BRANCH = "develop"
            env.TEMPLATE_BUCKET = "euc-picturator-templates-testing"
            env.SLACK_CHANNEL = "jenkins_notifications_testing"
            env.CLOUDFRONT_DISTRIBUTION_ID = "E29L71ZD2K03PE"
            env.DIRECTORY = 'bestcanvas3-se'
          }

        }
      }
    }
    stage('checkout') {
      agent any
      steps {
        checkoutTemplates('base-template-adaptive-green')
      }
    }
    stage ('build+scan') {
      parallel {
        stage ('build') {
          agent {
            docker {
              image 'node:14-buster'
              args '-e HOME=/tmp'
            }
          }
          steps {
            buildTemplates()
          }
        }
      }
    }
    stage ('sync templates') {
      agent {
        dockerfile {
          dir 'merged'
        }
      }
      steps {
        deployTemplates()
           withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'cloudfront-jenkins-invalidation',
                          accessKeyVariable: 'AWS_ACCESS_KEY_ID', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']]) {
                 sh '''
                  if [ "${CLOUDFLARE_ZONE}" != "picanova.de" ]; then
                   aws cloudfront create-invalidation --distribution-id "${CLOUDFRONT_DISTRIBUTION_ID}" --paths "/*"
                  fi
                  '''
        }
      }
    }
  }
  post {
    always {
      node('master') {
        deleteDir()
      }
      reportBuildstatusToSlack(currentBuild.result, env.SLACK_CHANNEL)
    }
  }
}
