"use client";

import Badge from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import Textarea from "@/shared/ui/textarea";

import { useActionState } from "react";
import toast from "react-hot-toast";

import { MessageCircleWarning } from "lucide-react";

const FeedbackForm = () => {
  const [state, formAction, pending] = useActionState(handleSubmit, null);

  async function handleSubmit(state: any, data: any) {
    console.log(data.get("message"));
    await new Promise<void>((res) => {
      setTimeout(() => res(), 2000);
    });
    toast.success(
      "The message was sent successfully. Thanks for the feedback!",
    );
  }

  return (
    <form className="max-w-md" action={formAction}>
      <h2 className="text-xl mb-8 flex items-center gap-3">
        <MessageCircleWarning className="text-accent" size={24} /> Feedback
      </h2>
      <Textarea
        disabled={pending}
        name="message"
        label="Describe problem"
        rows={10}
        required
      />
      <Badge variant="warning" className="mb-5 mt-3">
        Do not provide confidential information.
      </Badge>
      <Button disabled={pending} type="submit" size="lg">
        Send
      </Button>
    </form>
  );
};

export default FeedbackForm;
