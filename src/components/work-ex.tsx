import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AccordionContent } from "@radix-ui/react-accordion";
import { ReactNode } from "react";

export function WorkEx() {
  return (
    <div className="h-screen ">
      <p className="md:text-4xl text-center font-semibold lg:text-5xl">
        Work Experience
      </p>
      <Accordion type="multiple" className="mt-10">
        <AccordionItem value="sei">
          <AccordionItem value="sei1">
            <AccordionTrigger>
              <ExperienceTile
                title="Software Engineering Intern"
                company="Genuin"
                duration="June 2022 - August 2022"
              />
            </AccordionTrigger>
            <ExContent>
              <p>
                Experience of the software development lifecycle. Worked on
                building a web application using React and Node.js.
              </p>
            </ExContent>
          </AccordionItem>
          <AccordionTrigger>
            <ExperienceTile
              title="Software Engineering Intern"
              company="Genuin"
              duration="June 2022 - August 2022"
            />
          </AccordionTrigger>
          <ExContent>
            <p>
              Experience of the software development lifecycle. Worked on
              building a web application using React and Node.js.
            </p>
          </ExContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function ExperienceTile({
  title,
  company,
  duration,
}: {
  title: string;
  company: string;
  duration: string;
}) {
  return (
    <div>
      <h3 className="text-2xl font-semibold">{title}</h3>
      <p className="text-lg">{company}</p>
      <p className="text-sm text-accent-2">{duration}</p>
    </div>
  );
}

function ExContent({ children }: { children: ReactNode }) {
  return <AccordionContent className="p-4">{children}</AccordionContent>;
}
