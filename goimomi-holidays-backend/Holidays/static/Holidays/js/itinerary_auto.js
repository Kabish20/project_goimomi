(function ($) {
    'use strict';

    $(document).ready(function () {
        const $daysInput = $('#id_days');
        if (!$daysInput.length) return;

        console.log("Itinerary auto-generator loaded.");

        // Identify the Itinerary inline group
        // Try reliable IDs first, then fallback to text search
        function getItineraryGroup() {
            let $g = $('#itinerary-group');
            if ($g.length) return $g;

            $g = $('#itineraryday_set-group');
            if ($g.length) return $g;

            return $('.inline-group').filter(function () {
                // Determine if it's the right group by checking the header text
                return $(this).find('h2').text().indexOf('Itinerary') !== -1;
            });
        }

        function updateRowContent() {
            const $group = getItineraryGroup();
            if (!$group.length) return;

            // In TabularInline, rows are <tr> with class 'form-row' but not 'empty-form'
            const $rows = $group.find('tr.form-row').not('.empty-form').filter(function () {
                return !$(this).find('input[id$="-DELETE"]').is(':checked');
            });

            $rows.each(function (index) {
                const $row = $(this);
                const dayNum = index + 1;

                // 1. Update Day Number field
                const $dayNumInput = $row.find('input[id$="-day_number"]');
                if ($dayNumInput.length) {
                    $dayNumInput.val(dayNum);
                }

                // 2. Update Title field if empty
                const $titleInput = $row.find('input[id$="-title"]');
                if ($titleInput.length) {
                    const currentVal = $titleInput.val();
                    if (!currentVal || currentVal.startsWith("Day ")) {
                        $titleInput.val('Day ' + dayNum);
                    }
                }
            });
        }

        // --- NEW: Itinerary Master Template Logic ---
        function handleTemplateChange(e) {
            const $select = $(e.target);
            // Check if it's a master template dropdown
            if (!$select.attr('id') || !$select.attr('id').includes('-master_template')) return;

            const templateId = $select.val();
            if (!templateId) return;

            const $row = $select.closest('tr');
            const $titleInput = $row.find('input[id$="-title"]');
            const $descInput = $row.find('textarea[id$="-description"]');

            console.log(`Fetching template data for ID: ${templateId}`);

            // Fetch template details from the new API endpoint
            $.getJSON(`/api/itinerary-masters/${templateId}/`, function (data) {
                if (data.title) {
                    $titleInput.val(data.title);
                }
                if (data.description) {
                    $descInput.val(data.description);
                }
            });
        }

        // Listen for changes on master_template selects
        $(document).on('change', 'select[id$="-master_template"]', handleTemplateChange);

        function adjustRows() {
            const target = parseInt($daysInput.val()) || 0;
            if (target <= 0) return;

            const $group = getItineraryGroup();
            if (!$group.length) return;

            // Identify current active rows
            const $activeRows = $group.find('tr.form-row').not('.empty-form').filter(function () {
                return !$(this).find('input[id$="-DELETE"]').is(':checked');
            });

            const current = $activeRows.length;

            if (current < target) {
                // Add rows
                const diff = target - current;
                // The 'Add another' link in TabularInline is usually in a tr.add-row or div.add-row
                const $addLink = $group.find('.add-row a');

                for (let i = 0; i < diff; i++) {
                    $addLink.click();
                }
            } else if (current > target) {
                // Remove (delete) extra rows
                const diff = current - target;

                // We want to remove the LAST 'diff' active rows
                // Re-fetch active rows to be safe or use what we captured if we iterate backwards
                // Best to iterate backwards on the active set
                for (let i = 0; i < diff; i++) {
                    // Find the last active row
                    const $rowsToCheck = $group.find('tr.form-row').not('.empty-form').filter(function () {
                        return !$(this).find('input[id$="-DELETE"]').is(':checked');
                    });

                    const $last = $rowsToCheck.last();
                    if (!$last.length) break;

                    const $deleteBtn = $last.find('.inline-deletelink');
                    const $deleteCheck = $last.find('input[id$="-DELETE"]');

                    // If it's a dynamic row (no PK saved yet, usually has a remove button in recent django or similar)
                    // In standard tabular inline, there's a delete checkbox or a 'remove' link if it was added dynamically.
                    // The .inline-deletelink is for dynamic rows.
                    if ($deleteBtn.length) {
                        $deleteBtn.click();
                    } else if ($deleteCheck.length) {
                        // Existing row from DB: check delete box and hide
                        $deleteCheck.prop('checked', true);
                        $last.hide();
                    } else {
                        // Fallback: if user hasn't saved yet, maybe just hiding/removing works depending on django version.
                        // But usually dynamic rows have the delete link.
                    }
                }
            }

            // Sync numbers/titles after a short delay to allow DOM updates
            setTimeout(updateRowContent, 100);
        }

        // Run when the number of days changes
        $daysInput.on('change blur', adjustRows);

        // Initial sync
        // setTimeout(adjustRows, 500); // Optional: if we want to enforce it on load
        // But usually on load we just want to ensure numbering is correct if they missed it
        updateRowContent();
    });
})(django.jQuery);
