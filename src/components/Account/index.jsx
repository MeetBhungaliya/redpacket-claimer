import { convertCurl, createAccount } from "@/api/client";
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
import { addAccountSchema } from "@/schema/account";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useBoolean } from "usehooks-ts";

const Account = () => {
  const visitorId = useVisitorId();
  const { value, setValue, setFalse } = useBoolean(false);
  const queryClient = useQueryClient();

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
      const parsedCurl = await convertCurl(values.curl);

      if (!parsedCurl || parsedCurl.error) {
        return form.setError("curl", { message: parsedCurl?.error || "Invalid CURL" });
      }

      const accountPayload = {
        label: values.label,
        data: parsedCurl,
        fingerprint: visitorId.data,
      };

      try {
        const res = await createAccount(accountPayload);
        if (res) {
          toast.success("Account added successfully");
          queryClient.invalidateQueries({ queryKey: ["accounts"] });
          handleClose();
        }
      } catch (error) {
        const errMsg = error?.response?.data?.message || error?.message || "Something went wrong";
        toast.error(errMsg);
      }
    } catch (error) {
      const errMsg = error?.response?.data?.error || "Invalid CURL command";
      form.setError("curl", { message: errMsg });
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
                        (Raw cURL command)
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
