"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import FormContainer from "./FormContainer";
import ImageInput from "./ImageInput";
import { SubmitButton } from "./Buttons";
import { type actionFunction } from "@/utils/types";
import { LuUser2 } from "react-icons/lu";

type ImageInputContainerProps = {
  image: string;
  name: string;
  action: actionFunction;

  children?: React.ReactNode;
  inputName: string;
  inputText: string;
};

function ImageInputContainer(props: ImageInputContainerProps) {
  const { image, name, action, inputName, inputText } = props;
  const userIcon = (
    <LuUser2 className="w-24 h-24 bg-primary rounded-md text-white mb-4" />
  );
  return (
    <div>
      {
        <div className="flex justify-between items-center">
          <FormContainer action={action}>
            {props.children}
            <div className="flex flex-col items-center">
              {image ? (
                <Image
                  src={image}
                  width={100}
                  height={100}
                  className="rounded-md object-cover mb-4 w-24 h-24"
                  alt={name}
                />
              ) : (
                userIcon
              )}
              <ImageInput
                isRequired={false}
                name={inputName}
                labelText={inputText}
              />
              <SubmitButton size="sm" />
            </div>
          </FormContainer>
        </div>
      }
    </div>
  );
}

export default ImageInputContainer;
