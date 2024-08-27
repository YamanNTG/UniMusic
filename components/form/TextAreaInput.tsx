import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

type TextAreaInputProps = {
  name: string;
  labelText?: string;
  defaultValue?: string;
};

function TextAreaInput({ name, labelText, defaultValue }: TextAreaInputProps) {
  return (
    <div className="mb-2">
      <Label htmlFor={name} className="capitalize">
        {labelText || name}
      </Label>
      <Textarea
        id={name}
        name={name}
        defaultValue={defaultValue || teacherDescription}
        rows={5}
        required
        className="leading-loose "
      />
    </div>
  );
}

const teacherDescription = `I have over [X] years of experience in teaching [Instrument Name] to students of all ages and skill levels. With a deep passion for music and a commitment to helping students achieve their full potential, I provide personalized lessons tailored to each individual's learning style and goals.
I specialize in [specific genres or techniques], offering a comprehensive curriculum that includes both technical proficiency and musical expression. Whether you're a beginner looking to start your musical journey or an advanced student aiming to refine your skills, I will guide you every step of the way.
Join my classes to develop your talent, build confidence, and explore the joy of making music!
`;

export default TextAreaInput;
