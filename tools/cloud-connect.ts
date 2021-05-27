const { AWS_REGION, S3_BUCKET, HEROKU_APP_NAME } = process.env

export const s3Prefix = HEROKU_APP_NAME ? `dvc-org-pulls/${HEROKU_APP_NAME}` : 'dvc-org-prod'
export const s3Url = `http://${S3_BUCKET}.s3-website.${AWS_REGION}.amazonaws.com/${s3Prefix}`
