import { CheckedCourse, Course } from '../@types'
import CreditsBanner from '../components/planner/CreditsBanner'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { AlertType } from '../components/planner/Alert'

describe("Examples of unit testing", () => {
    const getExampleCourse = (ects: number) : CheckedCourse[] => {
        return [{
            checked: true,
            info: {
                id: 1,
                course_id: 1,
                course_unit_id: 1,
                sigarra_id: 1,
                course: "PROG",
                name: "PROG",
                acronym: "PROG",
                url: "1",
                course_unit_year: 1,
                semester: 1,
                year: 1,
                schedule_url: "url",
                ects: ects,
                last_updated: "03/09/2023"
            }
        }]
    }

    test("CreditsBanner should render info with number of ECTS when ECTS < 36", () => {
        render(<CreditsBanner courses={getExampleCourse(20)}></CreditsBanner>)

        const alert = screen.getByRole("alert")
        expect(alert).toBeInTheDocument()
        expect(alert).toHaveTextContent("Total número de créditos selecionados: 20 ECTS.")
    })

    test("CreditsBanner should render error when ECTS > 42", () => {
        render(<CreditsBanner courses={getExampleCourse(43)}></CreditsBanner>)

        const alert = screen.getByRole("alert")
        expect(alert).toBeInTheDocument()
        expect(alert).toHaveTextContent("Créditos selecionados: 43 ECTS. O limite de créditos da U.Porto num semestre, por norma, é 42 ECTS.")
    })
})

describe("Examples of snapshot testing", () => {
    
})  