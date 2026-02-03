import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Textarea,
} from "@heroui/react"
import React, { useContext, useState } from "react"
import { ThemeContext } from "../theme-provider"
import { Controller, useForm } from "react-hook-form"
import { User } from "../../app/types"
import { Input } from "../input"
import { useUpdateUserMutation } from "../../app/services/userApi"
import { useParams } from "react-router-dom"
import { hasErrorField } from "../../utils/has-error-field"
import { ErrorMessage } from "../error-message"
import { MdOutlineEmail } from "react-icons/md"
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react"

type Props = {
    isOpen: boolean
    handleOpen: () => void
    user?: User;
}

export const EditProfile: React.FC<Props> = ({
    isOpen = false,
    handleOpen,
    user
}) => {
    const { theme } = useContext(ThemeContext)
    const [updateUser, { isLoading }] = useUpdateUserMutation()
    const [error, setError] = useState("")
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const { id } = useParams<{ id: string }>()

    const { handleSubmit, control } = useForm<User>({
        mode: "onChange",
        reValidateMode: "onBlur",
        defaultValues: {
            email: user?.email,
            name: user?.name,
            dateOfBirth: user?.dateOfBirth,
            bio: user?.bio,
            location: user?.location,
        },
    })

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files !== null) {
            setSelectedFile(event.target.files[0])
        }
    }

    const onSubmit = async (data: User) => {
        if (id) {
            try {
                const formData = new FormData()
                data.name && data.name !== user?.name && formData.append("name", data.name)
                data.email && data.email !== user?.email && formData.append("email", data.email)
                data.dateOfBirth && data.dateOfBirth !== user?.dateOfBirth &&
                    formData.append(
                        "dateOfBirth",
                        new Date(data.dateOfBirth).toISOString(),
                    )
                data.bio && data.bio !== user?.bio && formData.append("bio", data.bio)
                data.location && data.location !== user?.location && formData.append("location", data.location)
                selectedFile && data.avatarUrl !== user?.avatarUrl && formData.append("avatar", selectedFile)

                await updateUser({ userData: formData, id }).unwrap()
                handleOpen()
            } catch (err) {
                if (hasErrorField(err)) {
                    setError(err.data.error)
                }
            }
        }
    }

    return (
        <>

            {isOpen &&
                <Card
                    className={`${theme} text-foreground mt-10 mb-10 p-5 flex-1 bg-gray-600/35 rounded-4xl`}
                >

                    <>
                        <CardHeader className="flex flex-col gap-1">
                            Изменения профиля
                        </CardHeader>
                        <CardBody>
                            <form
                                className="flex flex-col gap-4"
                                onSubmit={handleSubmit(onSubmit)}
                            >
                                <Input
                                    control={control}
                                    name="email"
                                    label="Email"
                                    type="email"
                                    endContent={<MdOutlineEmail />}
                                />
                                <Input control={control} name="name" label="Имя" type="text" />
                                <input
                                    className="p-2 bg-violet-400/55 rounded-2xl cursor-pointer"
                                    name="avatarUrl"
                                    placeholder="Выберете файл: "
                                    type="file"
                                    onChange={handleFileChange}
                                />
                                <Input
                                    control={control}
                                    name="dateOfBirth"
                                    label="Дата Рождения"
                                    type="date"
                                    placeholder="Мой"
                                />
                                <Controller
                                    name="bio"
                                    control={control}
                                    render={({ field }) => (
                                        <Textarea
                                            className="bg-gray-500/40 border-2 rounded-2xl h-20"
                                            {...field}
                                            rows={4}
                                            placeholder="Ваша биография"
                                        />
                                    )}
                                />
                                <Input
                                    control={control}
                                    name="location"
                                    label="Местоположение"
                                    type="text"
                                />
                                <ErrorMessage error={error} />
                                <div className="flex gap-2 justify-end">
                                    <Button
                                        fullWidth
                                        color="primary"
                                        type="submit"
                                        isLoading={isLoading}
                                        className="cursor-pointer mt-2 mb-2 bg-emerald-400/20 text-emerald-600 p-3 rounded-2xl border-2"
                                    >
                                        Обновить профиль
                                    </Button>
                                </div>
                            </form>
                        </CardBody>
                        <CardFooter>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={handleOpen}
                                className="cursor-pointer bg-danger/50 text-danger-800 p-2 pl-3.5 pr-3.5 rounded-2xl"
                            >
                                Закрыть
                            </Button>
                        </CardFooter>
                    </>
                </Card>
            }
        </>

    )
}