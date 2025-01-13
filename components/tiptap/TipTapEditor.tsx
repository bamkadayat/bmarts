'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from "@tiptap/extension-underline"
import TipTapEditorMenuBar from './TipTapEditorMenuBar'
import "./TipTap.scss"

type TextEditorProps = {
    initialContent?: string
    onChange?: (content: string) => void
}

export default function TipTapEditor(
    {
        initialContent,
        onChange
    }: TextEditorProps
){
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                paragraph: {}, // Ensure paragraph is enabled
                orderedList: {
                    HTMLAttributes: {
                        class: 'custom-ordered-list'
                    }
                },
                bulletList: {
                    HTMLAttributes: {
                        class: 'custom-bullet-list'
                    }
                }
            }),
            Underline
        ],
        content: initialContent,
        onUpdate({ editor }) {
            onChange?.(editor.getHTML())
        },
        editorProps:{
            attributes: {
                class: 'min-h-[150px] cursor-text rounded-md border border-gray-300 p-5 ring-offset-background ring-offset-gray-100 ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-white'
            }
        },
        immediatelyRender: false
    })
    return (
        <div>
           {editor && <TipTapEditorMenuBar editor={editor} />}
            <EditorContent editor={editor} />
        </div>
    )
}