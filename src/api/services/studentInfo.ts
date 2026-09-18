import api from '../backend'

// Vite will automatically grab ALL .jpg and .png files inside the mock_avatars folder
const avatarsMap = import.meta.glob('../../images/mock_avatars/*.{jpg,jpeg,png}', { eager: true, import: 'default' })
const mockAvatars = Object.values(avatarsMap) as string[]

const getStudentPictureUrl = (username: string) => {
  if (!import.meta.env.PROD) {
    if (username.endsWith('999') && mockAvatars.length > 0) {
      // Deterministic pseudo-random index so the same user always gets the same avatar
      const index = parseInt(username.slice(0, -3) || '0', 10) % mockAvatars.length
      return mockAvatars[index]
    }
    return ''
  }

  return `${api.BACKEND_URL}/student/${username}/photo`
}

const studentInfoService = {
  getStudentPictureUrl,
}

export default studentInfoService
