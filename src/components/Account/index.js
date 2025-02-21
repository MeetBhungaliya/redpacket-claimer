"use client";

import { createAccount } from "@/actions/account";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CURL_PLACEHOLDER } from "@/constant/placeholder";
import { useVisitorId } from "@/context/Fingerprint";
import { getHeaders, getURL } from "@/lib/utils";
import { addAccountSchema, headerSchema } from "@/schema/account";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useBoolean } from "usehooks-ts";

const Account = () => {
  const visitorId = useVisitorId();
  const { value, setValue, setFalse } = useBoolean(false);

  const form = useForm({
    resolver: zodResolver(addAccountSchema),
    defaultValues: {
      label: "",
      curl: "",
    },
  });

  const onSubmit = async (values) => {
    if (!visitorId.data) return toast.error("Visitor id not found");

    try {
      const [url, headersResult] = await Promise.all([
        getURL(values.curl),
        getHeaders(values.curl),
      ]);

      const headers = headerSchema.safeParse(headersResult);

      if (!headers.success) {
        const error =
          JSON.parse(headers.error)?.[0]?.message ||
          "Unknown error parsing headers";

        return form.setError("curl", { message: error });
      }

      const data = {
        label: values.label,
        data: { url, headers: headers.data },
        fingerprint: visitorId.data,
      };

      try {
        const res = await createAccount(data);

        if (res instanceof Error) throw res;

        if (res) {
          toast.success("Account added successfully");
          handleClose();
        }
      } catch (error) {
        console.log(error?.message);
        if (error instanceof Error)
          return toast.error(error?.message || "Something went wrong");
        console.log(error);
      }
    } catch (error) {
      form.setError("curl", { message: "Invalid CURL" });
    }
  };

  const handleClose = () => {
    setTimeout(() => form.reset(), 300);
    setFalse();
  };

  return (
    <Dialog
      open={value}
      onOpenChange={(e) => {
        if (!e) return handleClose();
        setValue(e);
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-[#fcd535] text-[#202630] text-base font-semibold hover:bg-[#fcd535] hover:text-[#202630] hover:opacity-80"
        >
          Add Binance Account
        </Button>
      </DialogTrigger>
      <DialogContent
        className="p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="py-4 px-6 border-b rounded-t-lg bg-zinc-100">
          <DialogTitle>Binance Account</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-6"
          >
            <div className="px-6 space-y-6">
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter label" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="curl"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>
                      CURL&nbsp;
                      <small className="font-semibold">
                        (Copy as fetch (Node.js))
                      </small>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={CURL_PLACEHOLDER}
                        {...field}
                        className="min-h-56"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="px-6 py-4 flex gap-x-2 border-t rounded-b-lg bg-zinc-100">
              <Button
                type="button"
                size="lg"
                className="flex-1 text-base font-semibold"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                className="flex-1 text-base bg-[#fcd535] text-[#202630] font-semibold hover:bg-[#fcd535] hover:text-[#202630] hover:opacity-80"
              >
                Add
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default Account;
