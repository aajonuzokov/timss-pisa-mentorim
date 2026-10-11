import {
  GROUP_LABEL,
  STAGE_LABEL,
  isValidCode,
  normalizeCode,
  type Group,
  type Participant,
  type Stage,
} from "@/lib/participant";

const COURSES = ["1", "2", "3", "4", "Magistratura"];

export const isParticipantValid = (participant: Participant) =>
  participant.full_name.trim().length >= 3 &&
  participant.university.trim() !== "" &&
  participant.course !== "" &&
  isValidCode(participant.code) &&
  participant.consent;

type Props = {
  participant: Participant;
  setParticipant: (p: Participant) => void;
  stage: Stage;
  setStage: (s: Stage) => void;
  fixedStage?: Stage;
  triedSubmit: boolean;
};

/** Ishtirokchi ma'lumotlari: F.I.Sh., universitet, kurs, kod, bosqich, guruh va rozilik. */
export function ParticipantForm({
  participant,
  setParticipant,
  stage,
  setStage,
  fixedStage,
  triedSubmit,
}: Props) {
  const codeValid = isValidCode(participant.code);
  const participantValid = isParticipantValid(participant);
  return (
    <div
      className={`p-5 rounded-2xl border bg-card shadow-card ${triedSubmit && !participantValid ? "border-red-500" : ""}`}
    >
      <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3">
        Ishtirokchi ma'lumotlari
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        <input
          required
          maxLength={200}
          className="px-4 py-2.5 rounded-lg border bg-background"
          placeholder="F.I.Sh. *"
          aria-label="F.I.Sh."
          value={participant.full_name}
          onChange={(e) => setParticipant({ ...participant, full_name: e.target.value })}
        />
        <input
          required
          maxLength={200}
          className="px-4 py-2.5 rounded-lg border bg-background"
          placeholder="Universitet *"
          aria-label="Universitet"
          value={participant.university}
          onChange={(e) => setParticipant({ ...participant, university: e.target.value })}
        />
        <select
          required
          className="px-4 py-2.5 rounded-lg border bg-background"
          aria-label="Kurs"
          value={participant.course}
          onChange={(e) => setParticipant({ ...participant, course: e.target.value })}
        >
          <option value="">Kurs *</option>
          {COURSES.map((c) => (
            <option key={c} value={c}>
              {c === "Magistratura" ? c : `${c}-kurs`}
            </option>
          ))}
        </select>
      </div>
      <div className="grid sm:grid-cols-3 gap-3 mt-3">
        <label className="text-sm">
          <span className="block text-xs text-muted-foreground mb-1">
            Ishtirokchi kodi * (tashkilotchi bergan kod yoki avtomatik kod)
          </span>
          <input
            required
            maxLength={20}
            className={`w-full px-4 py-2.5 rounded-lg border bg-background font-mono tracking-wide ${triedSubmit && !codeValid ? "border-red-500" : ""}`}
            aria-label="Ishtirokchi kodi"
            value={participant.code}
            onChange={(e) =>
              setParticipant({ ...participant, code: normalizeCode(e.target.value) })
            }
          />
        </label>
        {fixedStage ? (
          <div className="text-sm">
            <span className="block text-xs text-muted-foreground mb-1">Bosqich</span>
            <div className="px-4 py-2.5 rounded-lg border bg-muted/50">
              {STAGE_LABEL[fixedStage]}
            </div>
          </div>
        ) : (
          <label className="text-sm">
            <span className="block text-xs text-muted-foreground mb-1">Bosqich</span>
            <select
              className="w-full px-4 py-2.5 rounded-lg border bg-background"
              aria-label="Bosqich"
              value={stage}
              onChange={(e) => setStage(e.target.value as Stage)}
            >
              {(Object.keys(STAGE_LABEL) as Stage[]).map((k) => (
                <option key={k} value={k}>
                  {STAGE_LABEL[k]}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="text-sm">
          <span className="block text-xs text-muted-foreground mb-1">Guruh (ixtiyoriy)</span>
          <select
            className="w-full px-4 py-2.5 rounded-lg border bg-background"
            aria-label="Guruh"
            value={participant.group}
            onChange={(e) => setParticipant({ ...participant, group: e.target.value as Group })}
          >
            {(Object.keys(GROUP_LABEL) as Group[]).map((k) => (
              <option key={k} value={k}>
                {GROUP_LABEL[k]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Kodni yozib qo'ying: kirish va yakuniy testda bir xil kod kiritilsa, natijalaringiz o'zaro
        solishtiriladi. Kod shu qurilmada eslab qolinadi.
      </p>
      <label
        className={`mt-3 flex items-start gap-2 text-sm p-3 rounded-lg border ${triedSubmit && !participant.consent ? "border-red-500" : ""}`}
      >
        <input
          type="checkbox"
          className="mt-1"
          checked={participant.consent}
          aria-label="Rozilik"
          onChange={(e) => setParticipant({ ...participant, consent: e.target.checked })}
        />
        <span>
          Test natijam va kiritgan ma'lumotlarim faqat ilmiy-tadqiqot maqsadida, umumlashtirilgan
          holda (ismim oshkor qilinmasdan) ishlatilishiga roziman. *
        </span>
      </label>
    </div>
  );
}
