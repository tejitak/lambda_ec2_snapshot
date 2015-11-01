// createSnapshots - Create snapshots from a list of volumes
// Include the AWS SDK and set the region
var AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-1';

// New EC2 object
var ec2 = new AWS.EC2();

// Build a YYYYMMDD formatted current date string
var now = new Date();
var year = now.getFullYear();
var month = now.getMonth() + 1;
month = (month < 10 ? "0" : "") + month;
var day = now.getDate();
day = (day < 10 ? "0" : "") + day;
now = year + month + day;

// List of volumes stored in an array of strings
var volumes = ['vol-a346b85c'];

// Epmty array to hod the new snapshot IDs
var snapshots = [];

var i = 0;

exports.createSnapshots = function(event, context) {
  for (index = 0; index < volumes.length; ++index) {
    var params = {
      VolumeId: volumes[index],
      Description: now + " daily Snapshot for " + volumes[index],
      DryRun: false
    };

    ec2.createSnapshot(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
      } else {
        console.log("Created snapshot request for %s", data.VolumeId);
        console.log(data);
        snapshots.push(data.SnapshotId);
        if (i == (volumes.length - 1)) {
          for (numsnaps = 0; numsnaps < snapshots.length; ++numsnaps) {
            console.log("Snapshot %s pending", snapshots[numsnaps]);
          }
          context.done();
        } else {
          ++i;
        }
      }
    });
  }
}; 