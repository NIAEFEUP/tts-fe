import api from "../backend"

const getStudentPictureUrl = (username: string) => {
    return `${api.BACKEND_URL}/student/${username}/photo`;
}

const studentInfoService = {
    getStudentPictureUrl
}

export default studentInfoService;