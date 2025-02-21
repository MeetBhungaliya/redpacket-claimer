"use client";

import { createUser, getUser, isUsernameAvailabel } from "@/actions/user";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useVisitorId } from "@/context/Fingerprint";
import { zodResolver } from "@hookform/resolvers/zod";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, CircleAlert, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  username: z
    .string()
    .min(2, "Username should be at least 2 characters long")
    .max(50),
});

const Header = () => {
  const [createUserModal, setCreateUserModal] = useState(false);
  const [showUsernameLoader, setShowUsernameLoader] = useState(false);
  const { data: visitorId } = useVisitorId();
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading: isUserLoading,
    isFetchedAfterMount,
  } = useQuery({
    queryKey: ["user", visitorId],
    queryFn: () => getUser({ fingerprint: visitorId }),
    enabled: Boolean(visitorId),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  useEffect(() => {
    if (isFetchedAfterMount && !Boolean(user)) {
      setCreateUserModal(true);
    }
  }, [isFetchedAfterMount]);

  const { mutate: createUserMutation, isLoading: isCreatingUser } = useMutation(
    {
      mutationFn: (username) =>
        createUser({ name: username, fingerprint: visitorId }),
      onSuccess: (data) => {
        setCreateUserModal(false);
      },
    }
  );

  const { data: isUsernameAvailable, isLoading: isUsernameLoading } = useQuery({
    queryKey: ["usernameAvailability", form.watch("username")],
    queryFn: () => isUsernameAvailabel({ name: form.watch("username") }),
    enabled: form.watch("username").length >= 2,
    gcTime: 0,
  });

  useEffect(() => {
    if (!isUsernameLoading) {
      setShowUsernameLoader(false);
    }
  }, [isUsernameLoading]);

  const onSubmit = async (values) => {
    if (!visitorId) return console.error("Visitor id not found");

    if (isUsernameAvailable) {
      createUserMutation(values.username);
    } else {
      form.setError("username", { message: "Username already taken" });
    }
  };

  return (
    <header className="h-16 px-10 flex justify-end items-center bg-slate-100 shadow-lg">
      {createUserModal ? (
        <h4 className="rounded-md scroll-m-20 text-xl font-semibold tracking-tight ">
          Enter your name 🥹
        </h4>
      ) : isUserLoading || !user ? (
        <Skeleton className="w-full max-w-[200px] h-7 rounded-sm" />
      ) : (
        <h4 className="rounded-md scroll-m-20 text-xl font-semibold tracking-tight">
          Welcome, {user.name}
        </h4>
      )}

      <Dialog open={createUserModal}>
        <DialogContent className="sm:max-w-[425px]" close={false}>
          <DialogHeader className="space-y-0">
            <VisuallyHidden.Root asChild>
              <DialogTitle>Create user</DialogTitle>
            </VisuallyHidden.Root>
            <DialogDescription className="flex items-end text-black text-base">
              <span className="text-black text-xl font-semibold">Hello,</span>
              &nbsp;What&apos;s your good name?&nbsp;
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="gap-4 py-4 border-y ">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="space-y-0 relative">
                      <FormControl>
                        <Input
                          {...field}
                          className="pr-8"
                          placeholder="Jhon Doe"
                          onChange={(e) => {
                            field.onChange(e);
                            setShowUsernameLoader(true);
                          }}
                        />
                      </FormControl>
                      <TooltipProvider delayDuration={300}>
                        <Tooltip>
                          <TooltipTrigger className="h-full aspect-square absolute right-0 top-1/2 -translate-y-1/2 flex justify-center items-center">
                            {form.watch("username").length >= 2 ? (
                              showUsernameLoader ? (
                                <LoaderCircle
                                  size={20}
                                  className="animate-spin"
                                />
                              ) : form.formState.errors.hasOwnProperty(
                                  "username"
                                ) ? (
                                <CircleAlert
                                  size={20}
                                  className="text-red-500"
                                />
                              ) : (
                                <Check size={20} className="text-green-500" />
                              )
                            ) : null}
                          </TooltipTrigger>
                          <TooltipContent className="bg-red-500">
                            <p className="text-[0.8rem] font-medium text-white">
                              {form.formState.errors?.username?.message}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={
                    !form.formState.isDirty ||
                    Boolean(Object.entries(form.formState.errors).length) ||
                    isCreatingUser
                  }
                >
                  Save username
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
