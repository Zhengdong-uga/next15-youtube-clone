"use client";

import { Suspense, useState, KeyboardEvent } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";
import Image from "next/image";
import {
  Briefcase,
  Globe,
  GraduationCap,
  Info,
  Mail,
  MapPin,
  PencilIcon,
  Play,
  PlusIcon,
  Signal,
  TrashIcon,
  Users,
  XIcon,
} from "lucide-react";

import { trpc } from "@/trpc/client";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface AboutSectionProps {
  userId: string;
}

interface LinkItem {
  title: string;
  url: string;
}

export const AboutSection = (props: AboutSectionProps) => {
  return (
    <Suspense fallback={<AboutSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <AboutSectionSuspense {...props} />
      </ErrorBoundary>
    </Suspense>
  );
};

const AboutSectionSkeleton = () => (
  <div className="space-y-2 max-w-2xl">
    <Skeleton className="h-6 w-32" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
  </div>
);

const AboutSectionSuspense = ({ userId }: AboutSectionProps) => {
  const [user] = trpc.users.getOne.useSuspenseQuery({ id: userId });
  const { isAdmin, isLoaded } = useIsAdmin();
  const utils = trpc.useUtils();

  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(user.name);
  const [draftDesc, setDraftDesc] = useState(user.description ?? "");
  const [draftLocation, setDraftLocation] = useState(user.location ?? "");
  const [draftEmail, setDraftEmail] = useState(user.contactEmail ?? "");
  const [draftStatus, setDraftStatus] = useState(user.currentStatus ?? "");
  const [draftEducation, setDraftEducation] = useState(user.education ?? "");
  const [draftSkills, setDraftSkills] = useState<string[]>(
    (user.skills as string[] | null) ?? []
  );
  const [skillInput, setSkillInput] = useState("");
  const [draftLinks, setDraftLinks] = useState<LinkItem[]>(
    (user.links as LinkItem[] | null) ?? []
  );

  const links = (user.links ?? []) as LinkItem[];
  const skills = (user.skills ?? []) as string[];

  const update = trpc.users.updateChannel.useMutation({
    onSuccess: () => {
      utils.users.getOne.invalidate({ id: userId });
      toast.success("Channel updated");
      setEditing(false);
    },
    onError: (err) => {
      console.error("updateChannel error:", err);
      toast.error(err.message ?? "Failed to update");
    },
  });

  const startEditing = () => {
    setDraftName(user.name);
    setDraftDesc(user.description ?? "");
    setDraftLocation(user.location ?? "");
    setDraftEmail(user.contactEmail ?? "");
    setDraftStatus(user.currentStatus ?? "");
    setDraftEducation(user.education ?? "");
    setDraftSkills((user.skills as string[] | null) ?? []);
    const existingLinks = (user.links as LinkItem[] | null) ?? [];
    setDraftLinks(existingLinks.length > 0 ? existingLinks : [{ title: "", url: "" }]);
    setSkillInput("");
    setEditing(true);
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !draftSkills.includes(trimmed) && draftSkills.length < 20) {
      setDraftSkills([...draftSkills, trimmed]);
      setSkillInput("");
    }
  };

  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  };

  const removeSkill = (index: number) => {
    setDraftSkills(draftSkills.filter((_, i) => i !== index));
  };

  const addLink = () => {
    setDraftLinks([...draftLinks, { title: "", url: "" }]);
  };

  const removeLink = (index: number) => {
    setDraftLinks(draftLinks.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, field: keyof LinkItem, value: string) => {
    const updated = [...draftLinks];
    updated[index] = { ...updated[index], [field]: value };
    setDraftLinks(updated);
  };

  const handleSave = () => {
    const validLinks = draftLinks
      .filter((l) => l.title.trim() && l.url.trim())
      .map((l) => ({
        title: l.title.trim(),
        url: l.url.trim().match(/^https?:\/\//) ? l.url.trim() : `https://${l.url.trim()}`,
      }));
    update.mutate({
      name: draftName.trim() || user.name,
      description: draftDesc.trim() || null,
      location: draftLocation.trim() || null,
      contactEmail: draftEmail.trim() || null,
      currentStatus: draftStatus.trim() || null,
      education: draftEducation.trim() || null,
      skills: draftSkills,
      links: validLinks,
    });
  };

  return (
    <div className="max-w-2xl">
      {isLoaded && isAdmin && !editing && (
        <div className="flex justify-end mb-4">
          <Button variant="outline" size="sm" onClick={startEditing}>
            <PencilIcon className="h-4 w-4 mr-1.5" />
            Edit channel info
          </Button>
        </div>
      )}

      {editing ? (
        <div className="space-y-6">
          <div>
            <label className="text-sm font-semibold mb-2 block">Channel Name</label>
            <Input
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder="Your channel name"
            />
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block">Description</label>
            <Textarea
              value={draftDesc}
              onChange={(e) => setDraftDesc(e.target.value)}
              rows={6}
              placeholder="Tell visitors about your channel..."
            />
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block">Current Status</label>
            <Input
              value={draftStatus}
              onChange={(e) => setDraftStatus(e.target.value)}
              placeholder="e.g. Open to work, Student at UGA, Freelancing"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold">Links</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLink}
                disabled={draftLinks.length >= 10}
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add link
              </Button>
            </div>
            <div className="space-y-3">
              {draftLinks.map((link, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="flex-1 space-y-2">
                    <Input
                      value={link.title}
                      onChange={(e) => updateLink(i, "title", e.target.value)}
                      placeholder="Title (e.g. LinkedIn)"
                    />
                    <Input
                      value={link.url}
                      onChange={(e) => updateLink(i, "url", e.target.value)}
                      placeholder="URL (e.g. linkedin.com/in/your-name)"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-1"
                    onClick={() => removeLink(i)}
                  >
                    <TrashIcon className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              {draftLinks.length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                  No links yet. Click &quot;Add link&quot; above.
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block">Contact Email</label>
            <Input
              type="email"
              value={draftEmail}
              onChange={(e) => setDraftEmail(e.target.value)}
              placeholder="e.g. you@example.com"
            />
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block">Education</label>
            <Input
              value={draftEducation}
              onChange={(e) => setDraftEducation(e.target.value)}
              placeholder="e.g. B.S. Computer Science, University of Georgia, 2026"
            />
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block">Location</label>
            <Input
              value={draftLocation}
              onChange={(e) => setDraftLocation(e.target.value)}
              placeholder="e.g. Athens, GA"
            />
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block">
              Skills / Technologies
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder="Type a skill and press Enter"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSkill}
                disabled={!skillInput.trim() || draftSkills.length >= 20}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {draftSkills.map((skill, i) => (
                <Badge key={i} variant="secondary" className="gap-1 pr-1">
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(i)}
                    className="hover:bg-muted rounded-full p-0.5"
                  >
                    <XIcon className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {draftSkills.length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                  No skills yet. Add technologies you work with.
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button size="sm" disabled={update.isPending} onClick={handleSave}>
              {update.isPending ? "Saving..." : "Save"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={update.isPending}
              onClick={() => setEditing(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-bold mb-2">Description</h2>
            {user.description ? (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {user.description}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No description yet.
              </p>
            )}
          </div>

          {skills.length > 0 && (
            <div className="pt-4 border-t">
              <h2 className="text-base font-bold mb-3">Skills &amp; Technologies</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <Badge key={i} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {links.length > 0 && (
            <div className="pt-4 border-t">
              <h2 className="text-base font-bold mb-4">Links</h2>
              <div className="space-y-1">
                {links.map((link, i) => {
                  let favicon: string | null = null;
                  try {
                    const domain = new URL(link.url).hostname;
                    favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
                  } catch { /* ignore */ }
                  return (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 py-2 rounded-lg hover:bg-accent/50 -mx-2 px-2 transition-colors"
                    >
                      {favicon ? (
                        <Image
                          src={favicon}
                          alt={link.title}
                          width={24}
                          height={24}
                          className="rounded-full flex-shrink-0"
                          unoptimized
                        />
                      ) : (
                        <Globe className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium leading-tight">{link.title}</p>
                        <p className="text-xs text-blue-600 truncate">
                          {link.url.replace(/^https?:\/\/(www\.)?/, '')}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <h2 className="text-base font-bold mb-4">More info</h2>
            <div className="space-y-5 text-sm">
              {user.currentStatus && (
                <div className="flex items-center gap-4">
                  <Briefcase className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                  <span>{user.currentStatus}</span>
                </div>
              )}
              {user.contactEmail && (
                <div className="flex items-center gap-4">
                  <Mail className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                  <a
                    href={`mailto:${user.contactEmail}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {user.contactEmail}
                  </a>
                </div>
              )}
              {user.education && (
                <div className="flex items-center gap-4">
                  <GraduationCap className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                  <span>{user.education}</span>
                </div>
              )}
              {user.location && (
                <div className="flex items-center gap-4">
                  <Globe className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                  <span>{user.location}</span>
                </div>
              )}
              <div className="flex items-center gap-4">
                <Info className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                <span>Joined {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
              {user.subscriberCount > 0 && (
                <div className="flex items-center gap-4">
                  <Users className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                  <span>{user.subscriberCount.toLocaleString()} subscribers</span>
                </div>
              )}
              <div className="flex items-center gap-4">
                <Play className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                <span>{user.videoCount.toLocaleString()} videos</span>
              </div>
              <div className="flex items-center gap-4">
                <Signal className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                <span>{typeof window !== 'undefined' ? window.location.origin : ''}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
