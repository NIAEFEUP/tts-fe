import api from "../backend"

const getStudentPictureUrl = (username: string) => {
    if (!import.meta.env.PROD) return ""

    return `${api.BACKEND_URL}/student/${username}/photo`;
}

const studentInfoService = {
    getStudentPictureUrl
}

export default studentInfoService;