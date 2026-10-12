export interface Certificate {
  readonly id: string;
  readonly number: string;
  readonly title: string;
  readonly issuer: string;
  readonly image: string;
  readonly link: string;
}

export const certificates = [
  {
    id: "web-development",
    number: "01",
    title: "Web Development",
    issuer: "SoloLearn",
    image: "assets/certificates/certificate-web-development.png",
    link: "https://www.sololearn.com/certificates/CC-FJWJUJLU",
  },
  {
    id: "java-intermediate",
    number: "02",
    title: "Java Intermediate",
    issuer: "SoloLearn",
    image: "assets/certificates/certificate-java.png",
    link: "https://www.sololearn.com/certificates/CC-HSFDSZX6",
  },
  {
    id: "javascript-intermediate",
    number: "03",
    title: "JavaScript Intermediate",
    issuer: "SoloLearn",
    image: "assets/certificates/certificate-javascript.png",
    link: "https://www.sololearn.com/certificates/CC-QBA7WK4F",
  },
  {
    id: "coding-foundation",
    number: "04",
    title: "Coding Foundation",
    issuer: "SoloLearn",
    image: "assets/certificates/certificate-coding.png",
    link: "https://www.sololearn.com/certificates/CC-B3ICHW6J",
  },
  {
    id: "frontend",
    number: "05",
    title: "Frontend",
    issuer: "SoloLearn",
    image: "assets/certificates/certificate-frontend.png",
    link: "https://www.sololearn.com/certificates/CC-3SGWCZA3",
  },
  {
    id: "introduction-html",
    number: "06",
    title: "Introduction to HTML",
    issuer: "SoloLearn",
    image: "assets/certificates/certificate-introduction-html.png",
    link: "https://www.sololearn.com/certificates/CC-FAODCLXN",
  },
  {
    id: "sql",
    number: "07",
    title: "SQL intermediate",
    issuer: "SoloLearn",
    image: "assets/certificates/certificate-sql.png",
    link: "https://www.sololearn.com/certificates/CC-P4PVL5UN",
  },
  {
    id: "c#",
    number: "08",
    title: "C Sharp intermediate",
    issuer: "SoloLearn",
    image: "assets/certificates/certificate-csharp.png",
    link: "https://www.sololearn.com/certificates/CC-XYZ12345",
  },
  {
    id: "CSS",
    number: "09",
    title: "Introduction to CSS",
    issuer: "SoloLearn",
    image: "assets/certificates/certificate-css.png",
    link: "https://www.sololearn.com/certificates/CC-JMHVNSG0",
  },
  {
    id: "C Intermediate",
    number: "10",
    title: "C Intermediate",
    issuer: "SoloLearn",
    image: "assets/certificates/certificate-c.png",
    link: "https://www.sololearn.com/certificates/CC-DPND06H2",
  },
  {
    id: "TypeScript AI Era",
    number: "11",
    title: "TypeScript AI Era",
    issuer: "SoloLearn",
    image: "assets/certificates/certificate-typescript.png",
    link: "https://www.sololearn.com/certificates/CC-BSLYG7GR",
  },
  {
    id: "Angular",
    number: "12",
    title: "Angular",
    issuer: "SoloLearn",
    image: "assets/certificates/certificate-angular.png",
    link: "https://www.sololearn.com/certificates/CC-01QX0FI2",
  },
] as const satisfies readonly Certificate[];
