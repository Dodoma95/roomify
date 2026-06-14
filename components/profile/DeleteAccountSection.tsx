"use client";

import { useState } from "react";
import { DeleteAccountModal } from "./DeleteAccountModal";

export function DeleteAccountSection() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <h1 className="text-[22px] font-semibold text-[#222222] mb-6">Zone danger</h1>

      <div className="border border-[#dddddd] rounded-[14px] p-6 bg-white">
        <h2 className="text-[16px] font-semibold text-[#c13515] mb-2">
          Supprimer mon compte
        </h2>
        <p className="text-[14px] text-[#6a6a6a] leading-relaxed mb-4">
          Cette action est irréversible. Toutes vos données, réservations et espaces
          seront supprimés définitivement.
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#c13515] text-white rounded-lg px-5 py-[11px] text-[14px] font-medium hover:bg-[#b32505] transition-colors"
        >
          Supprimer mon compte
        </button>
      </div>

      {showModal && <DeleteAccountModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
