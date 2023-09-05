# Code Along Course Outline / Materials
## 🚨 This is a Work in Progress!!! 🚨


# Intro

1. Heroku and netlify abstractioms over aws.  Platform as service.  Aws is very low level. Dev experience sucks
2. But they don’t scale well because you give up control.  Instacart started on heroku then had to move.  (Syntax flight control episode)
3. Security concerns with shared infrastructure of a heroku.
4. Costs more than raw aws.
    1. 80% cheaper than heroku at scale
5.
6.

# Setup Repo and First Build

1. Install next
    1. `npx create-next-app@latest`
    2. `npx lintier` without airbnb
    3. settings.json
        1. `"editor.codeActionsOnSave": {
            "source.fixAll": true
          },`
    4. verify autoformat on save
    5. Commit
    6. fix linting errors
        1. `npr lint:fix`
    7. Commit
2. Create a route with second page
    1. `app/foobar/page.tsx`
    2. Add link to this page on home page:
        1. `<Link href="/foobar">go to foobar page!</Link>`
    3. Client side spa style routing
    4. Commit
3. Create github repo
    1. `git remote add origin [https://github.com/josh-stillman/code-along.git](https://github.com/josh-stillman/code-along.git)`
        1. Get url from HTTPS dropdown
    2. push to repo
4. Build for production
    1. `npm run build`
        1. Build output shows `○ (Static)`
    2. Verify locally
        1. Inspect and show pre-rendered html
5. Setup Static builds
    1. [https://nextjs.org/docs/app/building-your-application/deploying/static-exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
    2. `const nextConfig = {
      output: 'export',
    trailingSlash: true, // needed for s3 hosting
    };`
    3. Run `npm run build` and inspect `.next/out` folder
    4. Serve static files
        1. `"serve-static": "npx serve ./out",`

# Setup AWS Account

1. Generous Free Tier for 1st year
2. Create account
    1. [https://aws.amazon.com/](https://aws.amazon.com/)
    2. click sign up button in nav bar
    3. Enter personal email and account name
    4. Verification code in email
        1. might be in spam folder
    5. Finish account sign up
        1. enter root password
        2. enter personal info
        3. enter credit card
        4. verify with SMS
            1. try the voice captcha option if chars are hard to read
    6. Choose basic plan
3. Setup Billing Alerts
    1. Type “billing” in text box
    2. Go to Billing Preferences
    3. Alert preferences
        1. AWS Free Tier alerts
        2. PDF invoices
    4. Budgets
        1. create budget
            1. zero spend budget
4. Setup Users
    1. Search for IAM in text bar
    2. Setup 2FA for Root
        1. Google authenticator
    3. Create account alias
        1. Go to dashboard
        2. create account alias
    4. Root user is only for billing, etc.  Never used again.
    5. Create admin user
        1. Users
        2. Add User
        3. Username: Admin
        4. Provide access to AWS MGMT Console
            1. Create IAM user (for programattic access)
            2. Custom Password
            3. Don’t user temporary password
        5. Attach policies directly
            1. Choose “AdministratorAccess”
            2. Check out the JSON - can do everything.
            3. No tags
                1. used for tracking
        6. Log out of root, log in as Admin
            1. Add MFA again
                1. Different phone name (use IAM user name)
                2. scan again

    # Setup s3 and route 53

    1. Simple Storage Service
        1. Store files
        2. s3 Accounts made up of buckets.  Buckets contain “objects” aka files.
        3. Can host web pages from buckets
        4. scalable, highly available and durable.
        5. key / value store. Flat hierarchy though the UI can show you “directories” if you want.
        6. Free tier: 5 gigs of storage
        7.
    2. Route 53
        1. Register Domain
        2. Do ahead of time to let the registration propagate
        3. verify the email when it comes
    3. s3
        1. create bucket with same name as your site
            1. acls disabled
            2. turn on public access
                1. dangerous but we’ll turn it off eventually.
                2. we want people to access the website
            3. keep versioning off
            4. default encryption
        2. bucket policies
            1. read but not write
            2. policy generator
                1. s3 Bucket
                2. Allow
                3. Principal: `*`
                4. Actions: `GetObject`
                5. copy s3 ARN from prior page with /*
                6. click add statement
                7. generate policy and copy

                    ```jsx
                    {
                        "Version": "2012-10-17",
                        "Id": "Policy1692219819119",
                        "Statement": [
                            {
                                "Sid": "Stmt1692219813668",
                                "Effect": "Allow",
                                "Principal": "*",
                                "Action": "s3:GetObject",
                                "Resource": "arn:aws:s3:::jss.computer/*"
                            }
                        ]
                    }
                    ```

                8. generate policy and copy
            3. upload the /out directory and all subdirectories
            4. Click index.html
                1. we’re on the internet!
                2. [`https://s3.amazonaws.com/jss.computer/index.html`](https://s3.amazonaws.com/jss.computer/index.html)
            5. go to Properties → static website hosting
                1. enable
                2. index.html as root
                3. 404.html as error
            6. Go to bucket website endpoint listed
                1. [http://jss.computer.s3-website-us-east-1.amazonaws.com](http://jss.computer.s3-website-us-east-1.amazonaws.com/)
                2. Root works
                3. Linking works
                4. 404 works
                5. Refreshing at any works thanks to trailing slash, which creates a new dir and index.html for each route
    4. Things to do:
        1. cdn
        2. better url
        3. no manual upload, ci/cd

# AWS CLI (necessary?)

1. Install CLI
    1. [https://aws.amazon.com/cli/](https://aws.amazon.com/cli/)
2. Generate access token
    1. TODO: SSO?
    2. IAM → User → Security Credentials → Create Access Key
    3. Copy paste both public key and secret.  Can only view once.
3. `aws configure`
    1. add all
    2. us-east-1
    3. json for output
4. `aws s3 ls s3://jss.computer`

# Route 53 for domain name

1. Setup main record
    1. Go to route 53 → Registered Domains
    2. hosted zone → click your zone → create record
    3. hit alias toggle
    4. alias to s3 website endpoint
    5. us-east-1
    6. auto fill endpoint
    7. create record
    8. go to your url.
        1. may need to wait a little bit

# SSL

1. Go to AWS Certificate Manager
    1. [https://us-west-1.console.aws.amazon.com/acm/home?region=us-west-1#/welcome](https://us-west-1.console.aws.amazon.com/acm/home?region=us-west-1#/welcome)
2. MAKE SURE you’re in us-east-1.  Only that can be used with cloudfront
3. Request cert → request public cert
    1. Add both the main name and wildcard in Fully Qualified name.
    2. `jss.computer`
    3. `*.jss.computer`
4. Click request
5. Click blue banner saying further action needed.
6. Under domains, click “create record in route 53” to prove you own it.
7. Need cloudfront to make it actually work.

# Redirect [www.](http://www.to) to main site

1. create another bucket
    1. don’t need public access for this one.
2. go to bucket properties
    1. static website hosting
    2. enable
3. Go to route 53
    1. add record to your domain
    2. for www
    3. alias
    4. to www bucket
4. Test out www.jss.computer
    1. it redirects!

# Cloudfront

1. Go to cloudfront
    1. [https://us-east-1.console.aws.amazon.com/cloudfront/v3/home?region=us-west-1#/distributions](https://us-east-1.console.aws.amazon.com/cloudfront/v3/home?region=us-west-1#/distributions)
2. Click create distribution
    1. click your main s3 bucket, then click convert to website
    2. Turn off WAF
    3. us and europe
    4. got down to cache policies
        1. keep compression on
        2. redirect http to https
    5. Alternate domains
        1. enter both
            1. jss.computer
            2. www.jss.computer
    6. default root object
        1. index.html without a slash
    7. Paste in cert.  MUST BE in east 1.
    8. Takes time to deploy
3. Go back to route 53 and point domain and www subdomain to cloudfront distribution
    1. autofill may not work.
    2. Copy distribution name from cloudfront ui
4. At this point we have:
    1. htttps and www working; along with routing.
    2. can delete second bucket
    3. redirects from http to https are working too!
5. Seal off bucket
    1. edit origin to be s3 bucket.
    2. turn on OAC
    3. Create control setting
    4. copy policy and go to bucket
    5. replace bucket policy and save
    6. turn off s3 public access
    7. save cloudfront policy
    8. double check website link from s3 and verify 403.
6. To make 404 work now:
    1. edit policy to include bucket name without trailing slash as well as listing the objects

        ```jsx
        {
            "Version": "2008-10-17",
            "Id": "PolicyForCloudFrontPrivateContent",
            "Statement": [
                {
                    "Sid": "AllowCloudFrontServicePrincipal",
                    "Effect": "Allow",
                    "Principal": {
                        "Service": "cloudfront.amazonaws.com"
                    },
                    "Action": [
                        "s3:GetObject",
                        "s3:ListBucket"
                    ],
                    "Resource": [
                        "arn:aws:s3:::jss.computer/*",
                        "arn:aws:s3:::jss.computer"
                    ],
                    "Condition": {
                        "StringEquals": {
                            "AWS:SourceArn": "arn:aws:cloudfront::225934246878:distribution/E2NYXH5S9T80Y5"
                        }
                    }
                }
            ]
        }
        ```


    1. Finalizing with cloudfront
        1. turn off public access
        2. use policy above
        3. configure a custom error page in cloudfront to be /404.html.  For this one you need the slash!
        4. Remove the trailing slash config in next and re-upload
        5. Everything now works ******except****** reloads from nested routes.
        6. Need a lambda edge function for these rewrites.
    2. Go to lambda
        1. create function
        2. name it html-redirect
        3. use defaults.  click create
        4. click add trigger, select cloudfront
        5. deploy to edge
            1. choose origin request along with your distribution
        6. write function to append .html to routes without a file extension

            ```jsx
            'use strict';
            export const handler = (event, context, callback) => {

                // Extract the request from the CloudFront event that is sent to Lambda@Edge
                var request = event.Records[0].cf.request;

                // Extract the URI from the request
                var olduri = request.uri;

                // Match any route after a slash without a file extension, and append .html

                if (olduri.match(/\/[^/.]+$/)) {
                  const newUri = olduri + '.html';
                  request.uri = newUri;
                  console.log("Old URI: " + olduri);
                  console.log("New URI: " + newUri);
                }

                // Return to CloudFront
                return callback(null, request);
            };

            export default handler;
            ```

        7. Need to add role before adding the trigger
            1. IAM → roles → find lambda role → trust relationship
            2. content

                ```jsx
                {
                    "Version": "2012-10-17",
                    "Statement": [
                        {
                            "Effect": "Allow",
                            "Principal": {
                                "Service": [
                                    "lambda.amazonaws.com",
                                    "edgelambda.amazonaws.com"
                                ]
                            },
                            "Action": "sts:AssumeRole"
                        }
                    ]
                }
                ```


        OMFG it works!


    # Github Action

    1. Create IAM user role for CI/CD
        1. IAM → Create Policy
            1. Choose Cloudfront → Create Invalidation → Copy ARN
            2. Choose S3 → ListBucket, PutObject, DeleteObject → Copy ARN
            3. Create policy and name it

                ```jsx
                {
                    "Version": "2012-10-17",
                    "Statement": [
                        {
                            "Sid": "VisualEditor0",
                            "Effect": "Allow",
                            "Action": [
                                "s3:PutObject",
                                "s3:ListBucket",
                                "s3:DeleteObject",
                                "cloudfront:CreateInvalidation"
                            ],
                            "Resource": [
                                "arn:aws:s3:::jss.computer",
                                "arn:aws:cloudfront::225934246878:distribution/E2NYXH5S9T80Y5"
                            ]
                        }
                    ]
                }
                ```

        2. Create user
            1. No aws console access
            2. attach policy you created
        3. Create access key
            1. bypass recommendation
                1. keys only shown once.  Keep it secret/safe
        4. Annoyingly, we need to update the bucket policy as well to let the user in.  Seems to be the only option at the moment if we want to block public access to the bucket but still let cloudfront in.
            1. See [https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html)

            ```jsx
            {
                "Version": "2012-10-17",
                "Id": "Policy1692219819119",
                "Statement": [
                    {
                        "Sid": "Stmt1692219813668",
                        "Effect": "Allow",
                        "Principal": {
                            "Service": "cloudfront.amazonaws.com"
                        },
                        "Action": [
                            "s3:GetObject",
                            "s3:ListBucket"
                        ],
                        "Resource": [
                            "arn:aws:s3:::jss.computer/*",
                            "arn:aws:s3:::jss.computer"
                        ],
                        "Condition": {
                            "StringEquals": {
                                "AWS:SourceArn": "arn:aws:cloudfront::225934246878:distribution/E2NYXH5S9T80Y5"
                            }
                        }
                    },
                    {
                        "Effect": "Allow",
                        "Principal": {
                            "AWS": "arn:aws:iam::225934246878:user/FE-CI-CD-Pipeline"
                        },
                        "Action": [
                            "s3:PutObject",
                            "s3:GetObject",
                            "s3:ListBucket",
                            "s3:DeleteObject"
                        ],
                        "Resource": [
                            "arn:aws:s3:::jss.computer/*",
                            "arn:aws:s3:::jss.computer"
                        ]
                    }
                ]
            }
            ```

    2. Setup Github Action
        1. Setup File
        2. Add Secrets to Github
            1. Settings → Security → Secrets & Variables →
        3. AWS_ACCESS_KEY_ID
        4. AWS_SECRET_ACCESS_KEY
        5. BUCKET_NAME
            1. `aws s3 ls` (or console)
        6. DISTRIBUTION_ID
            1. `aws cloudfront list-distributions` (or console)
        7. push up a change and voila!

# Create Strapi Backend and Dockerize

1. Create a new strapi project
    1. `npx create-strapi-app@latest code-along-api --quickstart -
    -typescript`
    2. This creates a strapi project with sqlite db
    3. See docs here

        [Quick Start Guide - Strapi Developer Docs | Strapi Documentation](https://docs.strapi.io/dev-docs/quick-start#_1-install-strapi-and-create-a-new-project)

    4. Create content type
        1. NewsItem
            1. singular and plural
        2. Add Title (short) Body (long) and PublicationDate (
    5. Create a first NewsItem
    6. Change permissions
        1. Settings → Roles → Public → News-item → click find and findOne → save
    7. `curl [http://localhost:1337/api/news-items](http://localhost:1337/api/news-items)`
2. Dockerize for production
    1. Download Docker
    2. Copy this file to Dockerfile in root dir (no extension)
        1. Call outs: package.json and npm install on different lines than copying the main app files.
        2. Used for caching.  If app files change but no dependencies, use cached dependencies.
    3. add .dockerignore.  Note that we’ll be copying over our local db

    ```
    # Keeping our local DB in place for now
    # .tmp/

    .cache/
    .git/
    build/
    node_modules/
    .env
    data/
    ```

    1. Test it locally
        1. `docker build -t strapi-test .`
        2. `docker images ls` - verify you see strapi-test
        3. `docker run -rm -p 1337:1337 --env-file .env strapi-test`
    2. If on an M1 must add prefix to image!
    3. Ensure you’re on a working version of strapi.  4.12.6 doesn’t work in production, use 4.12.1 instead.  Test by logging into admin dashboard at `/login`

    # Deploy to ECR & ECS

    ## ECR

    1. Search for ECR → Switch to US-East-1
    2. Click Create Repository
    3. Add a name, leave it private, leave all others disabled, click create.
    4. Push the image
        1. select your repository check box, then click View Push Commands
        2. Follow each step:
            1. Login `aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin [225934246878.dkr.ecr.us-east-1.amazonaws.com](http://225934246878.dkr.ecr.us-east-1.amazonaws.com/)`
            2. Build `docker build -t code-along .` We already did this.
            3. Tag with respository uri `docker tag code-along:latest [225934246878.dkr.ecr.us-east-1.amazonaws.com/code-along:latest](http://225934246878.dkr.ecr.us-east-1.amazonaws.com/code-along:latest)`
            4. Push `docker tag code-along:latest [225934246878.dkr.ecr.us-east-1.amazonaws.com/code-along:latest](http://225934246878.dkr.ecr.us-east-1.amazonaws.com/code-along:latest)`
    5. Click your repo and verify that the image is there
    6. Go to lifecycle policy and imageCountMoreThan 1, which caps it at the latest image

    ## ECS

    1. Create Cluster
        1. Keep Fargate selected (AWS finds resources for you)
        2. Default VPC
        3. Choose two subnets
        4. Don’t turn on monitoring for now.
        5. click create
    2. Go to Task Definitions on the side nav
        1. Create new Task Definition
            1. Name: `code-along-api-task-def`
            2. Keep fargate and linux x86
            3. no task role for now
            4. slim down to smallest resources: 1 vCPU and 2GB
                1. 1 vCPU = 1 thread, needed for Node.
            5. Hard limit must be 2GB as well
            6. Copy image URI from ECR
                1. [225934246878.dkr.ecr.us-east-1.amazonaws.com/code-along:latest](http://225934246878.dkr.ecr.us-east-1.amazonaws.com/code-along:latest)
                2. Using latest allows us to update.
            7. Add port 1337
            8. Don’t make read only.
            9. Add the env vars from the .env file
            10. Keep the logs on for now
        2. Create a Service (how to launch tasks —i.e. containers—defined by the definition you just created)
            1. select existing cluster
            2. keep default compute options
            3. Add service name `code-along-api-service` and keep defaults, including 1 task (1 container)
            4. Keep default VPC and subnets for now
            5. Create a new security group
                1. Open up ports 1337 (strapi), 80 (http) and 443 (https)
                2. Choose Custom TCP and Source of Anywhere
            6. Keep public IP (want this accessible from the internet for now.
            7. Click create
            8. Go to IP at 1337.  Try curling, and it should be up.

    # Backend CI/CD

    1. Let’s commit our DB for now.
        1. Update the .gitignore under Logs/DB

            ```
            ############################
            # Logs and databases
            ############################

            # For present purposes we'll commit our DB
            # .tmp
            ```

    2. Add IAM user for Backend CI/CD
        1. IAM - Policies - Create User
        2. Attach Policies
        3. Search for [AmazonEC2ContainerRegistryPowerUser](https://us-east-1.console.aws.amazon.com/iamv2/home?region=us-east-2#/policies/details/arn%3Aaws%3Aiam%3A%3Aaws%3Apolicy%2FAmazonEC2ContainerRegistryPowerUser)
        4. Copy to JSON
        5. Create Policy
        6. Copy JSON
        7. Scope to Resource
        8. Get ARN from ECR → Repositories → Summary
        9. Copy in ARN
        10. User must also have get token on *
        11. Needs PassRole and AssumeRole on the ecs task def role.  Copy the ARN from the Roles tab in IAM.
        12. Final policy should look like this:

        ```jsx
        {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": [
                        "ecr:GetAuthorizationToken",
                        "ecr:BatchCheckLayerAvailability",
                        "ecr:GetDownloadUrlForLayer",
                        "ecr:GetRepositoryPolicy",
                        "ecr:DescribeRepositories",
                        "ecr:ListImages",
                        "ecr:DescribeImages",
                        "ecr:BatchGetImage",
                        "ecr:GetLifecyclePolicy",
                        "ecr:GetLifecyclePolicyPreview",
                        "ecr:ListTagsForResource",
                        "ecr:DescribeImageScanFindings",
                        "ecr:InitiateLayerUpload",
                        "ecr:UploadLayerPart",
                        "ecr:CompleteLayerUpload",
                        "ecr:PutImage"
                    ],
                    "Resource": [
                        "arn:aws:ecr:us-east-1:225934246878:repository/code-along"
                    ]
                },
                {
                    "Effect": "Allow",
                    "Action": [
                        "ecr:GetAuthorizationToken",
                        "ecs:RegisterTaskDefinition",
                        "ecs:ListTaskDefinitions",
                        "ecs:DescribeTaskDefinition"
                    ],
                    "Resource": "*"
                },
                {
                    "Effect": "Allow",
                    "Action": "iam:PassRole",
                    "Resource": "arn:aws:iam::225934246878:role/ecsTaskExecutionRole"
                },
                {
                    "Effect": "Allow",
                    "Action": "sts:AssumeRole",
                    "Resource": "arn:aws:iam::225934246878:role/ecsTaskExecutionRolee"
                }
            ]
        }
        ```

        1. Create and name policy
        2. In create user tab, refresh policies and filter by customer managed
        3. attach BE-CI-CD policy
        4. Create User
        5. Click User and go to Security Credentials
        6. Create Token
        7. Skip warning
        8. Copy/Paste credentials somewhere safe (again, you won’t be able to view these again).
    3. Add Github action file
        1. Starter here: [https://docs.github.com/en/actions/deployment/deploying-to-your-cloud-provider/deploying-to-amazon-elastic-container-service](https://docs.github.com/en/actions/deployment/deploying-to-your-cloud-provider/deploying-to-amazon-elastic-container-service)
        2. `.github/workflows/main.yml`. Copy in starter.  It must be named main.
        3. We’re going to use the latest tag, so we can just keep the region and repository envs

            ```jsx
            env:
              AWS_REGION: us-east-1
              ECR_REPOSITORY: code-along
            ```

        4. Change the image tag env var to `latest`

            ```jsx
            - name: Build, tag, and push image to Amazon ECR
                    id: build-image
                    env:
                      ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
                      IMAGE_TAG: latest
            ```

        5. Delete the last two steps about task definition.  The last step should be `- name: Build, tag, and push image to Amazon ECR`
        6. Add secrets to backend github repo
            1. Settings → Security → Secrets and variables → Actions → new
            2. AWS_ACCESS_KEY_ID
            3. AWS_SECRET_ACCESS_KEY
        7. Now push up and verify!
            1. Github action should succeed
            2. You should see the new image in ECR
        8. But it doesn’t redeploy to ECS!

    # Secrets Manager

    1. Secrets Manager → Create secrets
        1. Paste in everything from the strapi .env file except port and host
        2. Add name, select all default options
    2. Need to give your task def permission to access the secrets
        1. [https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data-tutorial.html](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data-tutorial.html)
        2. Go to IAM → Roles → ecsTaskExecutionRole → Add Permissions → Inline policy
            1. Secrets Manger → ReadSecretValue
            2. Scope to the Arn of your secret, copied from secrets manager
            3. Should look like this:

            ```jsx
            {
            	"Version": "2012-10-17",
            	"Statement": [
            		{
            			"Sid": "VisualEditor0",
            			"Effect": "Allow",
            			"Action": "secretsmanager:GetSecretValue",
            			"Resource": "arn:aws:secretsmanager:us-east-1:225934246878:secret:prod/code-along-api-W3kDvu"
            		}
            	]
            }
            ```

    3. Edit task definition to use “ValueFrom” and paste in the secrets ARN for each.  Need to reference each key at the end of the ARN.  And need two additional colons at the end to reference default version stage and id.  See [https://docs.aws.amazon.com/AmazonECS/latest/developerguide/secrets-envvar-secrets-manager.html](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/secrets-envvar-secrets-manager.html)

        ```jsx
        {
            "taskDefinitionArn": "arn:aws:ecs:us-east-1:225934246878:task-definition/code-along-api-task-def:3",
            "containerDefinitions": [
                {
                    "name": "code-along-api",
                    "image": "225934246878.dkr.ecr.us-east-1.amazonaws.com/code-along:latest",
                    "cpu": 0,
                    "memory": 2048,
                    "memoryReservation": 2048,
                    "portMappings": [
                        {
                            "name": "code-along-api-80-tcp",
                            "containerPort": 80,
                            "hostPort": 80,
                            "protocol": "tcp",
                            "appProtocol": "http"
                        },
                        {
                            "name": "code-along-api-1337-tcp",
                            "containerPort": 1337,
                            "hostPort": 1337,
                            "protocol": "tcp",
                            "appProtocol": "http"
                        }
                    ],
                    "essential": true,
                    "environment": [],
                    "environmentFiles": [],
                    "mountPoints": [],
                    "volumesFrom": [],
                    "secrets": [
                        {
                            "name": "ADMIN_JWT_SECRET",
                            "valueFrom": "arn:aws:secretsmanager:us-east-1:225934246878:secret:prod/code-along-api-W3kDvu:ADMIN_JWT_SECRET"
                        },
                        {
                            "name": "API_TOKEN_SALT",
                            "valueFrom": "arn:aws:secretsmanager:us-east-1:225934246878:secret:prod/code-along-api-W3kDvu:API_TOKEN_SALT"
                        },
                        {
                            "name": "APP_KEYS",
                            "valueFrom": "arn:aws:secretsmanager:us-east-1:225934246878:secret:prod/code-along-api-W3kDvu:APP_KEYS"
                        },
                        {
                            "name": "DATABASE_CLIENT",
                            "valueFrom": "arn:aws:secretsmanager:us-east-1:225934246878:secret:prod/code-along-api-W3kDvu:DATABASE_CLIENT"
                        },
                        {
                            "name": "DATABASE_FILENAME",
                            "valueFrom": "arn:aws:secretsmanager:us-east-1:225934246878:secret:prod/code-along-api-W3kDvu:DATABASE_FILENAME"
                        },
                        {
                            "name": "JWT_SECRET",
                            "valueFrom": "arn:aws:secretsmanager:us-east-1:225934246878:secret:prod/code-along-api-W3kDvu:JWT_SECRET"
                        },
                        {
                            "name": "TRANSFER_TOKEN_SALT",
                            "valueFrom": "arn:aws:secretsmanager:us-east-1:225934246878:secret:prod/code-along-api-W3kDvu:TRANSFER_TOKEN_SALT"
                        }
                    ],
                    "ulimits": [],
                    "logConfiguration": {
                        "logDriver": "awslogs",
                        "options": {
                            "awslogs-create-group": "true",
                            "awslogs-group": "/ecs/code-along-api-task-def",
                            "awslogs-region": "us-east-1",
                            "awslogs-stream-prefix": "ecs"
                        },
                        "secretOptions": []
                    }
                }
            ],
            "family": "code-along-api-task-def",
            "executionRoleArn": "arn:aws:iam::225934246878:role/ecsTaskExecutionRole",
            "networkMode": "awsvpc",
            "revision": 3,
            "volumes": [],
            "status": "ACTIVE",
            "requiresAttributes": [
                {
                    "name": "com.amazonaws.ecs.capability.logging-driver.awslogs"
                },
                {
                    "name": "ecs.capability.execution-role-awslogs"
                },
                {
                    "name": "com.amazonaws.ecs.capability.ecr-auth"
                },
                {
                    "name": "com.amazonaws.ecs.capability.docker-remote-api.1.19"
                },
                {
                    "name": "ecs.capability.secrets.asm.environment-variables"
                },
                {
                    "name": "com.amazonaws.ecs.capability.docker-remote-api.1.21"
                },
                {
                    "name": "ecs.capability.execution-role-ecr-pull"
                },
                {
                    "name": "com.amazonaws.ecs.capability.docker-remote-api.1.18"
                },
                {
                    "name": "ecs.capability.task-eni"
                },
                {
                    "name": "com.amazonaws.ecs.capability.docker-remote-api.1.29"
                }
            ],
            "placementConstraints": [],
            "compatibilities": [
                "EC2",
                "FARGATE"
            ],
            "requiresCompatibilities": [
                "FARGATE"
            ],
            "cpu": "1024",
            "memory": "2048",
            "runtimePlatform": {
                "cpuArchitecture": "X86_64",
                "operatingSystemFamily": "LINUX"
            },
            "registeredAt": "2023-08-31T20:14:04.114Z",
            "registeredBy": "arn:aws:iam::225934246878:user/Admin",
            "tags": []
        }
        ```

    4. Go to your service, edit it, point it to the new task def revision, and force redeploy.
    5. Wait for task to redeploy and verify that it’s working.
        1. Services → Tasks → Network Bindings → 18.212.103.210:1337

    # Finalize CI/CD

    1. Copy the JSON of your task definition and save it to `.aws/task-definition.json`
        1. Make sure no secret values in it!!  This is why secrets manager was necessary.
    2. Update github action to render new task def, tag with commit sha, and push to service.

    ```jsx
    # This workflow uses actions that are not certified by GitHub.
    # They are provided by a third-party and are governed by
    # separate terms of service, privacy policy, and support
    # documentation.

    # GitHub recommends pinning actions to a commit SHA.
    # To get a newer version, you will need to update the SHA.
    # You can also reference a tag or branch, but the action may change without warning.

    name: Deploy to Amazon ECS

    on:
      push:
        branches:
          - main

      workflow_dispatch:

      # Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
      # However, do NOT cancel in-progress runs as we want to allow these production deployments to complete.
    concurrency:
      group: "frontend"
      cancel-in-progress: false

    env:
      AWS_REGION: us-east-1                           # set this to your preferred AWS region, e.g. us-west-1
      ECR_REPOSITORY: code-along                      # set this to your Amazon ECR repository name
      ECS_SERVICE: code-along-api-service-2           # set this to your Amazon ECS service name
      ECS_CLUSTER: code-along-api                     # set this to your Amazon ECS cluster name
      ECS_TASK_DEFINITION: .aws/task-definition.json  # set this to the path to your Amazon ECS task definition file, e.g. .aws/task-definition.json
      CONTAINER_NAME: code-along-api                  # set this to the name of the container in the
                                                      # containerDefinitions section of your task definition
    jobs:
      deploy:
        name: Deploy
        runs-on: ubuntu-latest
        environment: production

        steps:
          - name: Checkout
            uses: actions/checkout@v3

          - name: Configure AWS credentials
            uses: aws-actions/configure-aws-credentials@0e613a0980cbf65ed5b322eb7a1e075d28913a83
            with:
              aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
              aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
              aws-region: ${{ env.AWS_REGION }}

          - name: Login to Amazon ECR
            id: login-ecr
            uses: aws-actions/amazon-ecr-login@62f4f872db3836360b72999f4b87f1ff13310f3a

          - name: Build, tag, and push image to Amazon ECR
            id: build-image
            env:
              ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
              IMAGE_TAG: ${{ github.sha }}
            run: |
              # Build a docker container and
              # push it to ECR so that it can
              # be deployed to ECS.
              docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
              docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
              echo "image=$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG" >> $GITHUB_OUTPUT

          - name: Fill in the new image ID in the Amazon ECS task definition
            id: task-def
            uses: aws-actions/amazon-ecs-render-task-definition@c804dfbdd57f713b6c079302a4c01db7017a36fc
            with:
              task-definition: ${{ env.ECS_TASK_DEFINITION }}
              container-name: ${{ env.CONTAINER_NAME }}
              image: ${{ steps.build-image.outputs.image }}

          - name: Deploy Amazon ECS task definition
            uses: aws-actions/amazon-ecs-deploy-task-definition@df9643053eda01f169e64a0e60233aacca83799a
            with:
              task-definition: ${{ steps.task-def.outputs.task-definition }}
              service: ${{ env.ECS_SERVICE }}
              cluster: ${{ env.ECS_CLUSTER }}
              wait-for-service-stability: true
    ```

    1. et voila!

    # Load Balancer, Route 53, SSL Cert.

    1. Right now we’re on ephemeral IPs, no dns, no https.  Let’s fix that.
    2. We need to create a load balancer in front of our ECS service and route traffic through that for DNS and SSL.
    3. Create new service
        1. select defaults for Environment
        2. defaults for deployment but select lastest task def revision
        3. networking: default vpc and same subnets as you selected in your cluster (us-east-1 1a and 1b subnets for me)
        4. Select the existing security group that allows 1337 and 80.
        5. DO assign a public IP this time.  Otherwise networking becomes very complex.  See this for more: [https://stackoverflow.com/questions/61265108/aws-ecs-fargate-resourceinitializationerror-unable-to-pull-secrets-or-registry](https://stackoverflow.com/questions/61265108/aws-ecs-fargate-resourceinitializationerror-unable-to-pull-secrets-or-registry)
        6. You can still restrict public access to this IP, which we’ll do later.
        7. Add a load balancer in the LB section
            1. name is code-along-api-lb
            2. Port to balance is 1337
            3. Listener is HTTPS on 443
            4. Choose your ACM certificate
            5. Create new target group on HTTP (verify).  We’ll use HTTP internally so we don’t need more certs, and use HTTPS for public traffic.
            6. name is code-along-api-tg
            7. healthcheck endpoint for strapi is `/_health`
    4. Setup route 53
        1. Add record
        2. Add subdomain of api.
        3. Check alias
        4. Route to Application and Classic LB
        5. In us-east-1
        6. Select the only one availabe.  Starts with dualstack and includes the name you gave your LB.
        7. Simple routing.

        1. Summming up what worked here:
            1. create a service with a load balancer.  public IP must be on.
            2. service must have a SG allowing for traffic on 1337 and 80
                1. 1337 is the app.  80 is http - I think it’s necessary for healthcheck?
            3. must create a separate security group for the load balancer, allowing public traffic on 443 for https.
            4. In the security group for the service, open those ports only to the SG for the load balancer.
            5. In route 53, route [api.jss.computer](http://api.jss.computer) to the load balancer.
            6. The key here is two separate security groups (and public IP for the service even though you won’t allow any public access to it).
            7. But we’re not done yet!  must configure the health check codes.
                1. Ec2 → Target Groups → TG from your service → health checks → codes → 200-204.
                2. Strapi will return a 204… and that doesn’t work by default.
            8. Verify that the public IP isn’t reachable directly.  SUCCESS FINALLY!
            9. Update our github action to point to new service
            10. update our IAM user for BE pipeline to use name of new service.


# Read newsfeed items from Strapi on FE

1. Need to setup a client component that will pull live data from strapi.
2. We’ll use SWR, which is a convention in Next.
3. `npm i-E swr`
4. Create a components dir at `src/components`
5. Create a `NewsFeed.tsx` component.
6. include the `'use client';` directive at the top, telling Next how to render it.
7. create a `.env` file at root with this line.  This is the default for all envs and will be committed into the repo.  These are client-side variables and ***not*** secrets, but we’ll still use GH secrets to configure the deployed envs for greater flexibility and colocation.
8. Add the component as seen here:
    1. https://github.com/josh-stillman/code-along/pull/1

    ```jsx
    'use client';
    import useSWR from 'swr';
    import { NewsItemsResponse } from '../types/api';
    import styles from './NewsFeed.module.css';

    const fetcher = (url: string) => fetch(url).then(res => res.json());

    const params = new URLSearchParams();

    params.set('sort', 'publishedAt:desc');

    export function NewsFeed() {
      const { data, error, isLoading } = useSWR<NewsItemsResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/news-items?${params.toString()}`,
        fetcher
      );

      if (isLoading) return <div>loading...</div>;

      if (error || !data?.data) return <div>failed to load</div>;

      return (
        <div className={styles.newsItemList}>
          <h1>NewsFeed! 🗞️</h1>

          {data.data.map(({ attributes, id }) => (
            <div key={id} className={styles.newsItem}>
              <h2>{attributes.Title}</h2>

              <h3>
                <i>{attributes.Body}</i>
              </h3>

              <span>{new Date(attributes.publishedAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      );
    }
    ```

    1. SWR is like React Query.  It will make the calls to the API on the client.
9. In your FE github repo, add a secret for the FE URL.  It’s not a “secret” per se, but we’ll use this to configure multiple environments.  Save it as `API_URL` and have it point to your deployed api - `https://api.jss.computer`
10. Inject the `API_URL` into your build step by adding this to your GH action in `main.yml`

    ```jsx
    build-and-deploy:
        runs-on: ubuntu-latest
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.API_URL }}
        steps:
          - name: Checkout
            uses: actions/checkout@v3
    ```

11. Make sure there are no build errors locally.  `npm run build`.  Fix or suppress them before pushing.
12.
