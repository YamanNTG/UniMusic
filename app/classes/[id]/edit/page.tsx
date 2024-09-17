import {
  fetchClassDetails,
  updateInstrumentImageAction,
  updateInstrumentAction,
  updateInstructorImageAction,
} from "@/utils/actions";
import FormContainer from "@/components/form/FormContainer";
import FormInput from "@/components/form/FormInput";
import PriceInput from "@/components/form/PriceInput";
import TextAreaInput from "@/components/form/TextAreaInput";
import { SubmitButton } from "@/components/form/Buttons";
import { redirect } from "next/navigation";
import ImageInputContainer from "@/components/form/ImageInputContainer";
import ImageInput from "@/components/form/ImageInput";
import CategoriesInput from "@/components/form/CategoriesInput";

async function editClassPage({ params }: { params: { id: string } }) {
  const instrument = await fetchClassDetails(params.id);
  if (!instrument) redirect("/");
  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize">
        Edit Instrument
      </h1>
      <div className="border p-8 rounded-md gap-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-y-4 md:grid-cols-2 ">
          <ImageInputContainer
            name={instrument.name}
            inputText="Update Instrument Image"
            inputName="instrumentUpdateImage"
            action={updateInstrumentImageAction}
            image={instrument.image}
          >
            <input type="hidden" name="id" value={instrument.id} />
          </ImageInputContainer>
          <ImageInputContainer
            name={instrument.name}
            inputText="Update Instructor Image"
            inputName="instructorUpdateImage"
            action={updateInstructorImageAction}
            image={instrument.instructorImage}
          >
            <input type="hidden" name="id" value={instrument.id} />
          </ImageInputContainer>
        </div>

        <FormContainer action={updateInstrumentAction}>
          <input type="hidden" name="id" value={instrument.id} />
          <div className="grid md:grid-cols-2 gap-8 mb-4 mt-8">
            <FormInput
              name="name"
              type="text"
              label="Name (20 limit)"
              defaultValue={instrument.name}
            />
            <FormInput
              name="tagline"
              type="text"
              label="Tagline (30 limit)"
              defaultValue={instrument.tagline}
            />
            <PriceInput defaultValue={instrument.price} />
            <CategoriesInput />
          </div>
          <TextAreaInput
            name="description"
            labelText="Description (10 - 100 words)"
            defaultValue={instrument.description}
          />

          <div className="flex flex-col items-center">
            <SubmitButton text="edit instrument" className="mt-12" />
          </div>
        </FormContainer>
      </div>
    </section>
  );
}

export default editClassPage;
