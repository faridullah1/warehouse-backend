const aws = require('aws-sdk');
const fs = require('fs');

aws.config.setPromisesDependency();
aws.config.update({
	accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
	region: process.env.REGION
});

const getParams = (folderName, file) => {
  return {
    ACL: 'public-read',
    Bucket: process.env.S3_BUCKET,
    Body: fs.createReadStream(file.path),
    Key: `${folderName}/${file.originalname}`
  };
};

const uploadToS3 = (file, folderName) =>
 	new Promise((resolve, reject) => {
    const s3 = new aws.S3();    
	const params = getParams(folderName, file);

	s3.upload(params, (err, data) => {
		if (err) reject(err);

		if (data) {
			fs.unlinkSync(file.path);
			resolve(data.Location);
		}
	});
});

module.exports = uploadToS3;