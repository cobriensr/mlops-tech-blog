// cloudfront-function.js
function handler(event) {
    var request = event.request;
    var uri = request.uri;
    
    // Check if the URI ends with a slash
    if (uri.endsWith('/')) {
        request.uri += 'index.html';
    }
    // If no file extension and not ending with slash, add /index.html
    else if (!uri.includes('.')) {
        request.uri += '/index.html';
    }
    
    return request;
}