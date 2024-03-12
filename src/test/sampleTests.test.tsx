import { CheckedCourse, Course } from '../@types'
import CreditsBanner from '../components/planner/CreditsBanner'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import renderer from 'react-test-renderer';
import FaqsPage from '../pages/Faqs'

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

/*
    Snapshot tests create a snapshot everytime the tests are ran, comparing the current snapshot with the previous one.
    These type of tests have the advantage of being simple to write for complex components.
*/
describe("Examples of snapshot testing", () => {
    test("Tests Faqs page rendering", () => {
        const tree = renderer
            .create(<FaqsPage></FaqsPage>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    })
})  