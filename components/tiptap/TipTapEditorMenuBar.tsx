import React from "react";
import {
  RiBold,
  RiItalic,
  RiStrikethrough,
  RiListOrdered2,
} from "react-icons/ri";
import { Editor } from "@tiptap/react";
import { BsTypeUnderline } from "react-icons/bs";
import { IoListOutline } from "react-icons/io5";

const buttons = (editor: Editor | undefined) => [
  {
    icon: <RiBold className="size-5" />,
    onClick: () => editor?.chain().focus().toggleBold().run(),
    isActive: editor?.isActive("bold"),
    disabled: !editor,
  },
  {
    icon: <BsTypeUnderline className="size-5" />,
    onClick: () => editor?.chain().focus().toggleUnderline().run(),
    isActive: editor?.isActive("underline"),
    disabled: !editor,
  },
  {
    icon: <RiItalic className="size-5" />,
    onClick: () => editor?.chain().focus().toggleItalic().run(),
    isActive: editor?.isActive("italic"),
    disabled: !editor,
  },
  {
    icon: <RiStrikethrough className="size-5" />,
    onClick: () => editor?.chain().focus().toggleStrike().run(),
    isActive: editor?.isActive("strike"),
    disabled: !editor,
  },
  {
    text: "Paragraph",
    onClick: () => editor?.chain().focus().setParagraph().run(),
    isActive: editor?.isActive("paragraph"),
    disabled: !editor,
  },
  {
    icon: <RiListOrdered2 className="size-5" />,
    onClick: () => editor?.chain().focus().toggleOrderedList().run(),
    isActive: editor?.isActive("orderedList"),
    disabled: !editor,
  },
  {
    icon: <IoListOutline className="size-5" />,
    onClick: () => editor?.chain().focus().toggleBulletList().run(),
    isActive: editor?.isActive("bulletList"),
    disabled: !editor,
  },
];

const Button = ({
  onClick,
  isActive,
  disabled,
  children,
}: {
  onClick: () => void;
  isActive: boolean | undefined;
  disabled?: boolean;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`p-2 hover:bg-gray-100 ${isActive ? "bg-gray-100" : ""}`}
  >
    {children}
  </button>
);

export default function TipTapEditorMenuBar({
  editor,
}: {
  editor: Editor | undefined;
}) {
  return (
    <div className="flex p-2 border-b border-gray-200">
      {buttons(editor).map(({ icon, onClick, isActive, disabled, text }, index) => (
        <Button key={index} onClick={onClick} isActive={isActive} disabled={disabled}>
          {icon ? icon : text}
        </Button>
      ))}
    </div>
  );
}