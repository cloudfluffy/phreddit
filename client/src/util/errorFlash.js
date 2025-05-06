export default function errorFlash(error, setFlash) {
    if (error.message === 'Network Error') {
        setFlash({ isSuccess: false, message: 'Connection to the server failed. The server may be down or unreachable at the moment.' });
    } else {
        const { response: { status, statusText, data: { message } } } = error
        setFlash({ isSuccess: false, message: `HTTP ${status} ${statusText}: ${message}` });
    }
}
