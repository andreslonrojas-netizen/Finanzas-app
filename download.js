const fs = require('fs');

async function download(url, filename) {
  const response = await fetch(url);
  const text = await response.text();
  fs.writeFileSync(filename, text);
  console.log('Saved', filename);
}

async function run() {
  await download('https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2MxZmM0OTkyNjU4OTRkYzZhNTI2ZGEzZGFmM2IyZjNiEgsSBxC2qqj9uQoYAZIBJAoKcHJvamVjdF9pZBIWQhQxODE2MDU0NDE5NjQzNjY4ODEwMQ&filename=&opi=96797242', 'dashboard.html');
  await download('https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzhlMjM3YmMxN2E3ZjQxNzViYzRiNzdhZjZiOWQyMjI5EgsSBxC2qqj9uQoYAZIBJAoKcHJvamVjdF9pZBIWQhQxODE2MDU0NDE5NjQzNjY4ODEwMQ&filename=&opi=96797242', 'transaction.html');
  await download('https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2Y1OWU0Zjg3ZDVlMDRiZGNhMDkzMTNiNDZjY2Y5ZmI0EgsSBxC2qqj9uQoYAZIBJAoKcHJvamVjdF9pZBIWQhQxODE2MDU0NDE5NjQzNjY4ODEwMQ&filename=&opi=96797242', 'budgets.html');
  await download('https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzZiOGNjYTBkZThmZTRmZjA5ZmMwMzQ4NGMzNjZmYmZiEgsSBxC2qqj9uQoYAZIBJAoKcHJvamVjdF9pZBIWQhQxODE2MDU0NDE5NjQzNjY4ODEwMQ&filename=&opi=96797242', 'reports.html');
  await download('https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2EzZmM3NzQ1N2JhZjQwNGFiNzQzM2VlNDM3Mzk3YjE1EgsSBxC2qqj9uQoYAZIBJAoKcHJvamVjdF9pZBIWQhQxODE2MDU0NDE5NjQzNjY4ODEwMQ&filename=&opi=96797242', 'profile.html');
}

run();
