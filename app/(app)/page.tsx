import { Bell } from "lucide-react";
import { TopBar } from "@/components/shell/app-shell";
import { GlassIconButton } from "@/components/ui/buttons";
import { GlassSearch } from "@/components/ui/search";
import { DueCard, DueList, HeroDesktop, HeroMobile, MobileSubjects, SubjectsCard, WeekCard } from "@/components/today";
import { student, today } from "@/lib/mock/subjects";

export default function TodayPage() {
  return (
    <>
      {/* Desktop · frame 21 */}
      <div className="hidden px-10 pt-[22px] pb-6 lg:block">
        <TopBar>
          <div className="flex-1" />
          <GlassSearch />
          <GlassIconButton icon={Bell} label="Oznámení" aria-disabled title="Oznámení připravujeme" />
        </TopBar>
        <header className="mt-[34px] flex flex-col gap-1.5">
          <p className="text-[13px] font-medium text-muted">{today.dateLabel}</p>
          <h1 className="text-[34px] leading-[1.1] font-semibold tracking-[-0.9px]">
            {today.greeting}, {student.firstNameVocative}
          </h1>
        </header>
        <div className="mt-7">
          <HeroDesktop />
        </div>
        <div className="mt-7 grid gap-3.5 lg:grid-cols-2 xl:h-[384px] xl:grid-cols-[1fr_340px_250px]">
          <DueCard className="lg:col-span-2 xl:col-span-1" />
          <SubjectsCard />
          <WeekCard />
        </div>
      </div>

      {/* Mobile · frame 25 */}
      <div className="flex flex-col px-4 pt-3 lg:hidden">
        <header className="flex items-center pt-1.5 pl-1">
          <div className="flex flex-1 flex-col gap-0.5">
            <p className="text-[13px] font-medium text-muted">{today.dateLabel}</p>
            <h1 className="text-[34px] font-bold tracking-[-0.9px]">Dnes</h1>
          </div>
          <span aria-label={student.name} role="img" className="mesh-hero flex size-10 items-center justify-center rounded-full text-[13px] font-semibold text-white ring-2 ring-white/80">
            {student.initials}
          </span>
        </header>
        <div className="mt-[18px]">
          <HeroMobile />
        </div>
        <h2 className="mt-[26px] text-[20px] font-semibold tracking-[-0.4px]">K opakování</h2>
        <div className="surface mt-2.5 rounded-[22px] py-1">
          <DueList />
        </div>
        <h2 className="mt-[26px] text-[20px] font-semibold tracking-[-0.4px]">Moje předměty</h2>
        <div className="mt-2.5">
          <MobileSubjects />
        </div>
      </div>
    </>
  );
}
