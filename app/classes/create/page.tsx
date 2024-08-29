import FormInput from "@/components/form/FormInput";
import FormContainer from "@/components/form/FormContainer";
import { createInstrumentAction } from "@/utils/actions";
import { SubmitButton } from "@/components/form/Buttons";
import PriceInput from "@/components/form/PriceInput";
import CategoriesInput from "@/components/form/CategoriesInput";
import TextAreaInput from "@/components/form/TextAreaInput";
import ImageInput from "@/components/form/ImageInput";

// function CreateInstrument() {
//   return (
//     <section>
//       <h1 className="text-2xl font-semibold mb-8 capitalize">Create Class</h1>
//       <div className="border p-8 rounded-md">
//         <h3 className="text-lg mb-4 font-medium">General Info</h3>
//         <FormContainer action={createInstrumentAction}>
//           <div className="grid md:grid-cols-2 gap-8 mb-4">
//             <FormInput
//               name="name"
//               type="text"
//               label="Name(20 limit)"
//               defaultValue="Violin Teacher"
//             />
//             <FormInput
//               name="tagline"
//               type="text"
//               label="Tagline(30 limit)"
//               defaultValue="Learn your dream instrument with me"
//             />
//             <PriceInput defaultValue={20} />
//             <CategoriesInput />
//           </div>
//           <TextAreaInput
//             name="description"
//             labelText="Description (10-1000 words)"
//           />
//           <div className="flex  justify-between mt-4">
//             <ImageInput
//               isRequired={true}
//               name="image"
//               labelText="Instrument Image"
//             />
//             <ImageInput
//               isRequired={true}
//               name="instructorImage"
//               labelText="Instructor Public Image"
//             />
//           </div>
//           <div className="flex justify-center">
//             <SubmitButton text="create class" className="mt-12" />
//           </div>
//         </FormContainer>
//       </div>
//     </section>
//   );
// }

// export default CreateInstrument;
import React from "react";

function page() {
  return <div>page</div>;
}

export default page;
